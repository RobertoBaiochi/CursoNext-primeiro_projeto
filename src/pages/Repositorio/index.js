import { useParams } from "react-router-dom";
import {
    Container,
    Owner,
    Loading,
    BackButton,
    IssuesList,
    PageActions,
    FilterList,
} from "./styles";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { FaArrowLeft } from "react-icons/fa";

function RepositorioPage() {
    const { repositorio } = useParams();
    const [repo, setRepo] = useState({});
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState([
        { state: "all", label: "Todas", active: true },
        { state: "open", label: "Abertas", active: false },
        { state: "close", label: "Fechadas", active: false },
    ]);
    const [filterIndex, serFilterIndex] = useState(0);

    useEffect(() => {
        async function load() {
            const [repositorioData, issuesData] = await Promise.all([
                api.get(`/repos/${repositorio}`),
                api.get(`/repos/${repositorio}/issues`, {
                    params: {
                        state: filters.find((f) => f.active).state,
                        per_page: 5,
                    },
                }),
            ]);

            setRepo(repositorioData.data);
            setIssues(issuesData.data);
            setLoading(false);
        }

        load();
    }, [repositorio, filters]);

    useEffect(() => {
        async function loadIssue() {
            const response = await api.get(`/repos/${repositorio}/issues`, {
                params: {
                    state: filters[filterIndex].state,
                    page,
                    per_page: 5,
                },
            });
            setIssues(response.data);
        }

        loadIssue();
    }, [page, repositorio, filters, filterIndex]);

    function handlePage(action) {
        setPage(action === "back" ? page - 1 : page + 1);
    }

    function handleIndex(index) {
        serFilterIndex(index);
    }

    if (loading) {
        return (
            <Loading>
                <h1>Carregando...</h1>
            </Loading>
        );
    }

    return (
        <Container>
            <BackButton to={"/"}>
                <FaArrowLeft color="#0b0b0b" size={30} />
            </BackButton>

            <Owner>
                <img src={repo.owner.avatar_url} alt={repo.owner.login} />

                <h1>{repo.name}</h1>
                <p>{repo.description}</p>
            </Owner>

            <FilterList active={filterIndex}>
                {filters.map((filter, index) => (
                    <button
                        type="button"
                        key={filter.label}
                        onClick={() => handleIndex(index)}
                    >
                        {filter.label}
                    </button>
                ))}
            </FilterList>

            <IssuesList>
                {issues.map((issue) => (
                    <li key={String(issue.id)}>
                        <img
                            src={issue.user.avatar_url}
                            alt={issue.user.login}
                        />

                        <div>
                            <strong>
                                <a href={issue.html_url}>{issue.title}</a>

                                {issue.labels.map((label) => (
                                    <span key={String(label.id)}>
                                        {label.name}
                                    </span>
                                ))}
                            </strong>

                            <p>{issue.user.login}</p>
                        </div>
                    </li>
                ))}
            </IssuesList>

            <PageActions>
                <button
                    type="button"
                    onClick={() => handlePage("back")}
                    disabled={page < 2}
                >
                    Voltar
                </button>
                <button type="button" onClick={() => handlePage("next")}>
                    Proxima
                </button>
            </PageActions>
        </Container>
    );
}

export default RepositorioPage;
