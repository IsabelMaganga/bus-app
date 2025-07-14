import axiosInstance from '@/config/axiosConfig';
import { useTheme } from "@/context/ThemeContext";
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, Alert, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { useSession } from '@/context/AuthContext';
import { router } from 'expo-router';
import axios from 'axios'; 
import Input from '../components/core/Input'

const SignupScreen = () => {
   const {currentTheme} = useTheme();
   const {signIn} = useSession();

  const [data,setData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: ""
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: ""
  });
  const [loading ,setLoading] = useState(false);

  const handleChange = (Key, value) =>{
      setData({...data, [Key]: value});
      // Clear error when user starts typing
      if(errors[Key]) {
        setErrors({...errors, [Key]: ""});
      }
  }
 
  const handleSignup = async () =>{
     setLoading(true);

     setErrors({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        phone: ""
     })

     // Mock backend simulation for testing
     const useMockBackend = true; // Set to false when real backend is ready

     if (useMockBackend) {
       // Simulate API delay
       await new Promise(resolve => setTimeout(resolve, 1500));
       
       // Validate inputs
       if (!data.name || !data.email || !data.password || !data.password_confirmation || !data.phone) {
         Alert.alert('Validation Error', 'Please fill in all fields');
         setLoading(false);
         return;
       }
       
       if (data.password !== data.password_confirmation) {
         Alert.alert('Validation Error', 'Passwords do not match');
         setLoading(false);
         return;
       }
       
       if (data.password.length < 8) {
         Alert.alert('Validation Error', 'Password must be at least 8 characters long');
         setLoading(false);
         return;
       }
       
       // Simulate successful registration
       const mockUser = {
         id: Math.floor(Math.random() * 1000),
         name: data.name,
         email: data.email,
         tickets: 0
       };
       
       const mockToken = 'mock_token_' + Date.now();
       
       // Store in local storage (simulate backend storage)
       try {
         await signIn(mockToken, mockUser);
         Alert.alert(
           'Success (Mock)', 
           'Account created successfully! This is using a mock backend. Install PHP 8.2+ and Laravel for real functionality.',
           [
             {
               text: 'OK',
               onPress: () => router.replace('/sign-in')
             }
           ]
         );
       } catch (error) {
         Alert.alert('Error', 'Failed to create account');
       }
       
       setLoading(false);
       return;
     }

     try{
         const response = await axiosInstance.post('/api/register', data);
         
         // Automatically log the user in after successful registration
         await signIn(response.data.token, response.data.user);
         
         // Show success message and redirect
         Alert.alert(
           'Success', 
           'Account created successfully! You are now logged in.',
           [
             {
               text: 'OK',
               onPress: () => router.replace('/sign-in')
             }
           ]
         );
         
     }catch(error){
      console.error('Registration error:', error);
      
      if(axios.isAxiosError(error)){
        const reponseData = error.response?.data;
        console.log('Response data:', reponseData);

        if(reponseData?.errors){
          setErrors(reponseData.errors)
        }else if(reponseData?.message){
          Alert.alert('Registration Error', reponseData.message);
        }else if(error.response?.status === 500){
          Alert.alert('Server Error', 'The server is currently unavailable. Please check if the backend server is running.');
        }else if(error.response?.status === 0){
          Alert.alert('Connection Error', 'Cannot connect to the server. Please check your internet connection and ensure the backend server is running.');
        }else{
          Alert.alert('Registration Error', `An error occurred during registration. Status: ${error.response?.status}`);
        }
      }else{
         console.error('Network error:', error);
         Alert.alert('Network Error', 'Please check your internet connection and try again.');
        }
      
     }finally{
       setLoading(false);
     }

  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Image 
            source={require('../assets/images/bel.png')} 
            style={styles.logo}
          />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us and start booking your bus tickets today!</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <Input
              placeholder="Enter your full name"
              value={data.name}
              onChangeText={(value)=> handleChange('name',value)}
              error={errors.name}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <Input
              placeholder="Enter your phone number"
              value={data.phone}
              keyboardType="phone-pad"
              onChangeText={(value) => handleChange('phone', value)}
              error={errors.phone}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <Input
              placeholder="Enter your email address"
              value={data.email}
              keyboardType="email-address"
              onChangeText={(value) => handleChange('email',value)}
              error={errors.email}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <Input
              placeholder="Create a strong password"
              value={data.password}
              secureTextEntry
              onChangeText={(value) => handleChange('password',value)}
              error={errors.password}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <Input
              placeholder="Confirm your password"
              value={data.password_confirmation}
              secureTextEntry
              onChangeText={(value) => handleChange('password_confirmation',value)}
              error={errors.password_confirmation}
            />
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.signupButton, loading && styles.signupButtonDisabled]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.signupButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Terms and Conditions */}
          <Text style={styles.termsText}>
            By creating an account, you agree to our{' '}
            <Text style={styles.linkText}>Terms of Service</Text> and{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </View>

        {/* Footer Section */}
        <View style={styles.footerSection}>
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.loginSection}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/sign-in')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#2D5BA5FF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
  },
  formSection: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  signupButton: {
    backgroundColor: '#2D5BA5FF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#2D5BA5FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signupButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  signupButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
  linkText: {
    color: '#2D5BA5FF',
    fontWeight: '600',
  },
  footerSection: {
    marginTop: 'auto',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#9ca3af',
    fontSize: 14,
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    fontSize: 16,
    color: '#6b7280',
  },
  loginLink: {
    fontSize: 16,
    color: '#2D5BA5FF',
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default SignupScreen; 