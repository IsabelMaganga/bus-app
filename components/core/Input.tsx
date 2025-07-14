import { TextInput} from "react-native";
import React, {useState} from "react";
import { View, Text, TextInputProps } from "react-native";


interface InputPros extends TextInputProps {
  error?: string;
}

const Input = ({
  value,
  placeholder,
  keyboardType,
  secureTextEntry,
  onChangeText,
  error = "",
}: InputPros) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View className="w-full mb-4">
      <TextInput
        className={`w-full h-12 border rounded-lg px-3 mb-1 ${
          error ? "border-red-500" : isFocus ? "border-blue-500" : ""
        }`}
        value={value}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
      />
      {!!error && (
        <Text className="text-left text-red-500 text-sm mt-1">
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;