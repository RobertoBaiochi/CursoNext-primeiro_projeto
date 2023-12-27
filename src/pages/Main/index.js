import { useState, useCallback, useEffect } from "react";
import { Container, Form, SubmitButton, List, DeleteButton } from "./styles";
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

import api from "../../services/api";

function MainPage() {
    const [newRepo, setNewRepo] = useState("");
    const [repositorios, setRepositorios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    // DidMount - buscar

    useEffect(() => {
        const repoStorage = localStorage.getItem("repos");

        console.log("Montando", repoStorage);

        if (repoStorage) {
            setRepositorios(JSON.parse(repoStorage));
        }
    }, []);

    // DidUpdate - salvar alterações

    useEffect(() => {
        localStorage.setItem("repos", JSON.stringify(repositorios));
        console.log("Update", repositorios);
    }, [repositorios]);

    const handleInputChange = (e) => {
        setNewRepo(e.target.value);
        setAlert(null);
    };

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            async function submit() {
                setLoading(true);
                setAlert(null);
                try {
                    if (!newRepo) {
                        throw new Error("Você precisa indicar um repositório!");
                    }

                    const hasRepo = repositorios.find(
                        (repo) => repo.name === newRepo
                    );

                    if (hasRepo) {
                        throw new Error("Repositório duplicado.");
                    }

                    const response = await api.get(`/repos/${newRepo}`);

                    const data = {
                        name: response.data.full_name,
                    };

                    setRepositorios([...repositorios, data]);
                    setNewRepo("");
                } catch (err) {
                    setAlert(true);
                    console.log(err);
                } finally {
                    setLoading(false);
                }
            }

            submit();
        },
        [newRepo, repositorios]
    );

    const handleDelete = useCallback(
        (repo) => {
            const find = repositorios.filter((r) => r.name !== repo);

            setRepositorios(find);
        },
        [repositorios]
    );

    return (
        <Container>
            <h1>
                <FaGithub size={25} />
                Meus Repositórios
            </h1>

            <Form onSubmit={handleSubmit} error={alert}>
                <input
                    type="text"
                    placeholder="Adicionar Repositório"
                    value={newRepo}
                    onChange={handleInputChange}
                />

                <SubmitButton loading={loading ? 1 : 0}>
                    {loading ? (
                        <FaSpinner color="#fbfbfb" size={14} />
                    ) : (
                        <FaPlus color="#fbfbfb" size={14} />
                    )}
                </SubmitButton>
            </Form>

            <List>
                {repositorios.map((repo) => (
                    <li key={repo.name}>
                        <span>
                            <DeleteButton
                                onClick={() => handleDelete(repo.name)}
                            >
                                <FaTrash size={14} />
                            </DeleteButton>
                            {repo.name}
                        </span>
                        <Link
                            to={`/repositorio/${encodeURIComponent(repo.name)}`}
                        >
                            <FaBars size={20} />
                        </Link>
                    </li>
                ))}
            </List>
        </Container>
    );
}

export default MainPage;
