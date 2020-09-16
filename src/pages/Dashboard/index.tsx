import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from "react-router-dom";
import api from '../../services/api';
import logoImg from '../../assets/logo.svg';
import { Title, Form, Repositories, Error } from './styles';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  }
}

const Dashboard: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepositories = localStorage.getItem('@GithubExplorer:repositories');

    if (storagedRepositories) {
      return JSON.parse(storagedRepositories)
    };

    return [];
  });
  const [searchedRepository, setSearchedRepository] = useState('');
  const [inputError, setInputError] = useState('');

  useEffect(() => { 
    localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories));
  }, [repositories]);

  async function handleAddRepository(event:FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!searchedRepository) {
      setInputError('Digite o autor/nome do repositório');
      return;
    }
    
    try {
      const { data } = await api.get(`repos/${searchedRepository}`);
    
      setRepositories([...repositories, data]);
      
      setSearchedRepository('');
      setInputError('');
    } catch (error) {
      setInputError('Erro na busca por esse repositório');
    }

  }

  return (
    <>
      <img src={logoImg} alt="GitHub Explorer" />
      
      <Title>Dashboard</Title>
      
      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={searchedRepository}
          onChange={ (e) => setSearchedRepository(e.target.value) }
          placeholder="Digite o nome do repositório"
          type="text"
          name="searchedRepository"
          id="searchedRepository"
        />
        <button type="submit">Pesquisar</button>
      </Form>
      {
        inputError && <Error>{inputError}</Error>
      }
      <Repositories>

        {
          repositories.map(repository => (
            <Link key={repository.full_name} to={`repository/${repository.full_name}`}>
              <img src={ repository.owner.avatar_url } alt={ repository.owner.login }/>
              <div>
                <strong>{ repository.full_name }</strong>
                <p>{ repository.description }</p>
              </div>
              <FiChevronRight size={20}/>
            </Link>
          ))
        }
        
      </Repositories>
    </>);
};

export default Dashboard;
