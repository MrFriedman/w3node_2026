import { Text, View } from 'react-native'
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular'
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold'
import { SpaceGrotesk_600SemiBold } from '@expo-google-fonts/space-grotesk/600SemiBold'
import { useFonts } from 'expo-font'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { ClaimScreen } from './src/ClaimScreen'
import { colors } from './src/theme'

export default function App() {
  const [loaded, error] = useFonts({ Inter_400Regular, Inter_600SemiBold, SpaceGrotesk_600SemiBold })
  return <SafeAreaProvider><SafeAreaView style={{ flex: 1, backgroundColor: colors.paper }}>
    <StatusBar style="dark" />
    {loaded || error ? <ClaimScreen /> : <View style={{ padding: 24 }}><Text accessibilityRole="alert">Loading HowlPay…</Text></View>}
  </SafeAreaView></SafeAreaProvider>
}
