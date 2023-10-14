import { ContentLayout } from "./components/ContentLayout";
import NavBar from "./components/NavBar";
import Wordle from "./components/Wordle";
import toast, { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <NavBar></NavBar>
      <main>
        <ContentLayout>
          <Toaster></Toaster>
          <Wordle></Wordle>
        </ContentLayout>
      </main>
    </>
  )
}

export default App
