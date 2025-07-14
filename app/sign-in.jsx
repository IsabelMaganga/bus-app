import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React,  { useState } from 'react';
import Input from '../components/core/Input'
import { useSession } from '@/context/AuthContext';
import { Link, router } from 'expo-router';
import axios from 'axios';
import axiosInstance from '@/config/axiosConfig';

const SignInScreen = () => {
   const {signIn} = useSession();
   const [loading ,setLoading] = useState(false);
   const [data, setData] = useState({
     email: "",
     password: ""
   });
   const [errors, setErrors] = useState({
     email: "",
     password: ""
   });
   
   const handleChange = (Key, value) => {
      setData( {...data, [Key]:value});
      setErrors({...errors, [Key]: ""})
   }
   
   const handleLogin = async () => {
     setLoading(true);
     setErrors({ email: "", password: ""})

     // Mock backend simulation for testing
     const useMockBackend = true; // Set to false when real backend is ready

     if (useMockBackend) {
       // Simulate API delay
       await new Promise(resolve => setTimeout(resolve, 1000));
       
       // Validate inputs
       if (!data.email || !data.password) {
         Alert.alert('Validation Error', 'Please fill in all fields');
         setLoading(false);
         return;
       }
       
       // Simulate successful login
       const mockUser = {
         id: 1,
         name: 'Test User',
         email: data.email,
         tickets: 0
       };
       
       const mockToken = 'mock_token_' + Date.now();
       
                try {
           await signIn(mockToken, mockUser);
           router.replace('/(app)/hom');
         } catch (error) {
         Alert.alert('Error', 'Failed to login');
       }
       
       setLoading(false);
       return;
     }

     try{
       const response = await axiosInstance.post('/api/login', data);
       await signIn(response.data.token, response.data.user)

       // Explicitly redirect to the home tab after successful login
       router.replace('/(app)/hom')
     }catch(error){
        if(axios.isAxiosError(error)){
        const reponseData = error.response?.data;

        if(reponseData?.errors){
          setErrors(reponseData.errors)
        }else if(reponseData?.message){
          Alert.alert('Error ',reponseData.message);
        }else{
          Alert.alert('Error occured')
        }}
        else{
            console.error('Error');
          Alert.alert('Error , Server') ;
        }         
       }finally{
         setLoading(false);
       }
   }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 justify-center">
       
        <View className="items-center mb-12">
          <Text className="text-3xl font-bold text-gray-800">Login</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Input
              placeholder="Enter your email"
              value={data.email}
              keyboardType="email-address"
              onChangeText={(value) => handleChange('email',value)}
              error={errors.email}
             />
          </View>

          <View>
            <Input 
              placeholder="Enter your password"
              value={data.password}
              onChangeText={(value) => handleChange('password',value)}
              secureTextEntry
              error={errors.password}     
            />
          </View>

          <TouchableOpacity
            className="w-full h-12 bg-blue-400 rounded-lg justify-center items-center mt-6"
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className="text-white font-semibold text-lg">
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-600">Don't have an account? </Text>
          <TouchableOpacity>
            <Link href="/signup">
              <Text className="text-blue-400 font-medium">Sign up</Text>
            </Link>   
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignInScreen; 