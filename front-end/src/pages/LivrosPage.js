import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { livroService } from '../services/api'; 

function LivrosPage() {
    // Inicializa como um array vazio para evitar o erro .map (CORRETO)
    const [livros, setLivros] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '',
        autor: '',
        isbn: ''
    });

    useEffect(() => {
        fetchLivros();
    }, []);

    // --- FUNÇÃO DE BUSCAR (READ / CONSULTAR) - CORRIGIDA ---
    const fetchLivros = async () => {
        setLoading(true);
        try {
            const response = await livroService.listar();
            const data = response.data;

            // CLAUSULA DE SEGURANÇA: Garante que o estado é sempre um array antes do .map()
            if (Array.isArray(data)) {
                setLivros(data);
            } else {
                // Se o Back-end enviou um objeto ou erro, setamos um array vazio para não quebrar a UI
                setLivros([]);
                console.error("A API não retornou uma lista. Recebido:", data);
            }
        } catch (error) {
            console.error("Erro ao buscar livros (Backend falhou):", error);
        } finally {
            setLoading(false);
        }
    };
    
    // --- FUNÇÕES DE LÓGICA (CREATE, UPDATE, DELETE) ---
    // (A lógica de salvamento e exclusão permanece a mesma, mas agora deve funcionar se o Back-end estiver correto)
    
    const handleInputChange = (e) => { 
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value }); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await livroService.atualizar(editingId, formData);
            } else {
                await livroService.salvar(formData);
            }
            alert("Operação realizada com sucesso!");
            resetForm();
            fetchLivros();
        } catch (error) {
            console.error("Erro ao salvar livro:", error);
            alert("Erro ao salvar livro. Verifique o console ou a validação do Backend.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este livro?")) {
            try {
                await livroService.excluir(id);
                alert("Livro excluído.");
                fetchLivros();
            } catch (error) {
                console.error("Erro ao excluir livro:", error);
                alert("Erro ao excluir. O livro pode ter empréstimos vinculados.");
            }
        }
    };

    const handleEdit = (livro) => {
        setEditingId(livro.id);
        setFormData({ titulo: livro.titulo, autor: livro.autor, isbn: livro.isbn });
    };

    const resetForm = () => { setEditingId(null); setFormData({ titulo: '', autor: '', isbn: '' }); };


    // --- RENDERIZAÇÃO (JSX) ---
    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <Link to="/dashboard">← Voltar</Link>
            <h1>Gestão de Acervo (Livros)</h1>

            {/* Formulário */}
            <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <h3>{editingId ? 'Editar Livro (RF03)' : 'Cadastrar Novo Livro (RF01)'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input type="text" name="titulo" placeholder="Título do Livro" value={formData.titulo} onChange={handleInputChange} required style={{ padding: '8px' }}/>
                    <input type="text" name="autor" placeholder="Autor" value={formData.autor} onChange={handleInputChange} required style={{ padding: '8px' }}/>
                    <input type="text" name="isbn" placeholder="ISBN" value={formData.isbn} onChange={handleInputChange} style={{ padding: '8px' }}/>
                    
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button type="submit" style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer', flex: 1 }}>
                            {editingId ? 'Salvar Alterações' : 'Cadastrar Livro'}
                        </button>
                        {editingId && <button type="button" onClick={resetForm} style={{ padding: '10px', background: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}>Cancelar</button>}
                    </div>
                </form>
            </div>

            {/* Lista de Livros Cadastrados */}
            <h2>Acervo ({livros.length})</h2>
            {loading && <p>Carregando...</p>}
            
            {!loading && livros.length === 0 && <p>Nenhum livro cadastrado. Tente adicionar um!</p>}

            {!loading && (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {/* AQUI O .map AGORA É SEGURO */}
                    {livros.map(livro => (
                        <li key={livro.id} style={{ borderBottom: '1px solid #eee', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <strong>{livro.titulo}</strong> <br />
                                <small>Autor: {livro.autor} | ISBN: {livro.isbn || 'N/A'}</small>
                            </div>
                            <div>
                                <button onClick={() => handleEdit(livro)} style={{ marginRight: '5px' }}>Editar (RF03)</button>
                                <button onClick={() => handleDelete(livro.id)}>Excluir (RF04)</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default LivrosPage;