import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Pages
import Home from './components/Home';
import MemoDetail from './components/MemoDetail';
import MemoEditor from './components/MemoEditor';
import Settings from './components/Settings';
import NotFound from './components/NotFound';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const MainContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const ContentContainer = styled.main`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

function App() {
  return (
    <AppContainer>
      <Header />
      <MainContainer>
        <Sidebar />
        <ContentContainer>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/memo/:id" element={<MemoDetail />} />
            <Route path="/create" element={<MemoEditor />} />
            <Route path="/edit/:id" element={<MemoEditor />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ContentContainer>
      </MainContainer>
    </AppContainer>
  );
}

export default App;