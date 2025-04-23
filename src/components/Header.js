import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch, FaCog, FaPlus } from 'react-icons/fa';

const HeaderContainer = styled.header`
  background-color: var(--primary-color);
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  margin: 0;
  
  a {
    color: white;
    text-decoration: none;
    display: flex;
    align-items: center;
    
    &:hover {
      color: var(--secondary-color);
    }
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 500px;
  margin: 0 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px 8px 36px;
  border-radius: 20px;
  border: none;
  outline: none;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
  
  &:focus {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.7);
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 16px;
`;

const ActionButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  transition: var(--transition);
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    color: white;
  }
`;

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // TODO: Implement search functionality
  };
  
  return (
    <HeaderContainer>
      <Logo>
        <Link to="/">SmartMemo</Link>
      </Logo>
      
      <SearchContainer>
        <SearchIcon>
          <FaSearch />
        </SearchIcon>
        <SearchInput
          type="text"
          placeholder="メモを検索..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </SearchContainer>
      
      <ActionsContainer>
        <ActionButton to="/create" title="新規メモ作成">
          <FaPlus />
        </ActionButton>
        <ActionButton to="/settings" title="設定">
          <FaCog />
        </ActionButton>
      </ActionsContainer>
    </HeaderContainer>
  );
}

export default Header;