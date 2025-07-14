import { Redirect, Slot} from "expo-router";
import { ThemeProvider } from "@/context/ThemeContext";
import "../global.css";
import { SessionProvider, useSession } from "@/context/AuthContext";
import { StatusBar } from "expo-status-bar";

function Header(){
  const {session, isLoading} = useSession();

  if(isLoading) {
    return (
      <>
        <StatusBar style="dark"/>
        <Slot/>
      </>
    );
  }

  if(session) {
    return(
      <> 
        <StatusBar style="dark"/>
        <Redirect href="/(app)/hom" />
      </>
    )
  }

  return (
    <>
      <StatusBar style="dark"/>
      <Slot/>
    </>
  );
}

export default function RootLayout() {
  return (
    <SessionProvider>
      <ThemeProvider>
        <Header/>
      </ThemeProvider>
    </SessionProvider>
  );
} 