import { ContentLayout } from "./components/ContentLayout";
import NavBar from "./components/NavBar";
import Wordle from "./components/Wordle";


function App() {
  return (
    <>
      <NavBar></NavBar>
      <main>
        <ContentLayout>
          <Wordle></Wordle>
        </ContentLayout>
      </main>
    </>
  )
}

export default App
