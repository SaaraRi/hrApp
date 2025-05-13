import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import PersonsList from './components/PersonsList/PersonsList';

function App() {
 

  return (
    <>
      <Header logo="HR Manager App" />
      <main>
        <PersonsList />
      </main>
      <Footer year={2025} />
    </>
  )
};

export default App;
