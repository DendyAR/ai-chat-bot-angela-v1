import { ThemeProvider } from "@/components/theme-provider"
import Page from "./layout/page"
import { Provider } from "react-redux"
import { store } from "./store"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Provider store={store}>
      <Page/>
      </Provider>
    </ThemeProvider>
  )
}

export default App
