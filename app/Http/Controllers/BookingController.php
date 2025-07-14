<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Payment;
use App\Services\PayChanguService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    /**
     * Create a new booking
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'passenger_name' => 'required|string|max:255',
            'from_location' => 'required|string|max:255',
            'to_location' => 'required|string|max:255',
            'travel_date' => 'required|date|after:today',
            'next_of_kin_phone' => 'required|string|regex:/^(\+265|265)?[789]\d{8}$/',
            'passenger_phone' => 'required|string|regex:/^(\+265|265)?[789]\d{8}$/',
            'selected_seats' => 'required|array|min:1',
            'selected_seats.*' => 'string|max:10',
            'payment_method' => 'required|string|in:airtel,mpamba,tnm,card',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // Create booking
            $booking = Booking::create([
                'user_id' => $request->user()->id,
                'passenger_name' => $request->passenger_name,
                'from_location' => $request->from_location,
                'to_location' => $request->to_location,
                'travel_date' => $request->travel_date,
                'next_of_kin_phone' => $request->next_of_kin_phone,
                'passenger_phone' => $request->passenger_phone,
                'selected_seats' => $request->selected_seats,
                'total_amount' => 0, // Will be calculated
                'payment_method' => $request->payment_method,
                'status' => 'pending',
                'booking_reference' => Booking::generateReference(),
            ]);

            // Calculate total amount
            $booking->total_amount = $booking->calculateTotalAmount();
            $booking->save();

            // Create payment record
            $payment = Payment::create([
                'user_id' => $request->user()->id,
                'reference' => Payment::generateReference(),
                'amount' => $booking->total_amount,
                'currency' => 'MWK',
                'payment_method' => $request->payment_method,
                'phone_number' => $request->passenger_phone,
                'description' => "Bus ticket payment - {$booking->booking_reference}",
                'status' => 'pending',
            ]);

            // Link payment to booking
            $booking->payment_id = $payment->id;
            $booking->save();

            // Initialize payment with PayChangu
            $paychanguResponse = $payment->initializePayChanguPayment();

            if ($paychanguResponse['success']) {
                return response()->json([
                    'success' => true,
                    'message' => 'Booking created successfully',
                    'data' => [
                        'booking' => [
                            'id' => $booking->id,
                            'booking_reference' => $booking->booking_reference,
                            'passenger_name' => $booking->passenger_name,
                            'from_location' => $booking->from_location,
                            'to_location' => $booking->to_location,
                            'travel_date' => $booking->formatted_travel_date,
                            'selected_seats' => $booking->selected_seats,
                            'total_amount' => $booking->total_amount,
                            'payment_method' => $booking->payment_method,
                            'status' => $booking->status,
                        ],
                        'payment' => [
                            'id' => $payment->id,
                            'reference' => $payment->reference,
                            'amount' => $payment->amount,
                            'currency' => $payment->currency,
                            'payment_url' => $paychanguResponse['data']['payment_url'] ?? null,
                            'checkout_url' => $paychanguResponse['data']['checkout_url'] ?? null,
                            'business_code' => $this->getBusinessCode($request->payment_method),
                        ],
                    ],
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Booking created but payment initialization failed',
                    'error' => $paychanguResponse['message'] ?? 'Unknown error',
                    'data' => [
                        'booking' => [
                            'id' => $booking->id,
                            'booking_reference' => $booking->booking_reference,
                        ],
                    ],
                ], 500);
            }
        } catch (\Exception $e) {
            Log::error('Booking creation failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Booking creation failed',
                'error' => 'Internal server error',
            ], 500);
        }
    }

    /**
     * Get booking details
     */
    public function show(Request $request, $id): JsonResponse
    {
        try {
            $booking = Booking::where('id', $id)
                ->where('user_id', $request->user()->id)
                ->with(['payment'])
                ->first();

            if (!$booking) {
                return response()->json([
                    'success' => false,
                    'message' => 'Booking not found',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'booking' => [
                        'id' => $booking->id,
                        'booking_reference' => $booking->booking_reference,
                        'passenger_name' => $booking->passenger_name,
                        'from_location' => $booking->from_location,
                        'to_location' => $booking->to_location,
                        'travel_date' => $booking->formatted_travel_date,
                        'selected_seats' => $booking->selected_seats,
                        'total_amount' => $booking->total_amount,
                        'payment_method' => $booking->payment_method,
                        'status' => $booking->status,
                        'created_at' => $booking->created_at,
                    ],
                    'payment' => $booking->payment ? [
                        'id' => $booking->payment->id,
                        'reference' => $booking->payment->reference,
                        'status' => $booking->payment->status,
                        'amount' => $booking->payment->amount,
                        'paid_at' => $booking->payment->paid_at,
                    ] : null,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Booking retrieval failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve booking',
                'error' => 'Internal server error',
            ], 500);
        }
    }

    /**
     * Get user's booking history
     */
    public function history(Request $request): JsonResponse
    {
        try {
            $bookings = Booking::where('user_id', $request->user()->id)
                ->with(['payment'])
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $bookings->items(),
                'pagination' => [
                    'current_page' => $bookings->currentPage(),
                    'last_page' => $bookings->lastPage(),
                    'per_page' => $bookings->perPage(),
                    'total' => $bookings->total(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Booking history fetch failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch booking history',
                'error' => 'Internal server error',
            ], 500);
        }
    }

    /**
     * Cancel a booking
     */
    public function cancel(Request $request, $id): JsonResponse
    {
        try {
            $booking = Booking::where('id', $id)
                ->where('user_id', $request->user()->id)
                ->where('status', 'pending')
                ->first();

            if (!$booking) {
                return response()->json([
                    'success' => false,
                    'message' => 'Booking not found or cannot be cancelled',
                ], 404);
            }

            $booking->update(['status' => 'cancelled']);

            return response()->json([
                'success' => true,
                'message' => 'Booking cancelled successfully',
                'data' => [
                    'booking_id' => $booking->id,
                    'status' => $booking->status,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Booking cancellation failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel booking',
                'error' => 'Internal server error',
            ], 500);
        }
    }

    /**
     * Get business code for payment method
     */
    private function getBusinessCode(string $paymentMethod): string
    {
        $businessCodes = config('paychangu.business_codes', []);
        return $businessCodes[$paymentMethod] ?? '';
    }
} 