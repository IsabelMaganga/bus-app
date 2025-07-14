import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function TabsLayout(){
   return (
    <Tabs
       screenOptions={{
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "fffff0",
        tabBarStyle : {
            backgroundColor: "#ffffff",
            borderTopColor: "#fffffff"
        },
        headerShown: false
       }}
    >
        <Tabs.Screen 
            name="hom"
            options={{
                title: 'Home',
                tabBarIcon: ({color, size}) => (
                    <MaterialIcons name="home" size={size} color={color} />
                )
            }}
        />
        <Tabs.Screen 
            name="operation"
            options={{
                title: 'operation',
                tabBarIcon: ({color, size}) => (
                    <MaterialIcons name="list" size={size} color={color} />
                )
            }}
        />
        <Tabs.Screen 
            name="profile"
            options={{
                title: 'profile',
                tabBarIcon: ({color, size}) => (
                    <MaterialIcons name="person" size={size} color={color} />
                )
            }}
        />
    </Tabs>
   )
} 