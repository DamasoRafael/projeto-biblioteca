import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { membroService } from '../services/api';

function MembrosPage({ onLogout }) {
    const [membros, setMembros] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: 'senha123',
        role: 'MEMBRO'
    });

    useEffect(() => {
        fetchMembros();
    }, []);

    const fetchMembros = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await membroService.listar();
            setMembros(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            setError('Erro ao buscar membros');
            console.error(err);
            setMembros([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validações básicas
        if (!formData.nome.trim()) {
            setError('Nome é obrigatório');
            return;
        }
        if (!formData.email.trim()) {
            setError('Email é obrigatório');
            return;
        }
        if (!editingId && !formData.senha.trim()) {
            setError('Senha é obrigatória para novo membro');
            return;
        }

        try {
            const payload = {
                nome: formData.nome,
                email: formData.email,
                role: formData.role,
            };

            // Adiciona senha apenas se foi preenchida
            if (formData.senha.trim()) {
                payload.senha = formData.senha;
            }

            if (editingId) {
                await membroService.atualizar(editingId, payload);
                alert('Membro atualizado com sucesso!');
            } else {
                await membroService.salvar(payload);
                alert('Membro cadastrado com sucesso!');
            }
            resetForm();
            fetchMembros();
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data || 'Erro ao salvar membro';
            setError(typeof errorMsg === 'string' ? errorMsg : 'Erro ao salvar membro');
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este membro?')) {
            try {
                await membroService.excluir(id);
                alert('Membro excluído com sucesso!');
                fetchMembros();
            } catch (err) {
                setError('Erro ao excluir membro');
                console.error(err);
            }
        }
    };

    const handleEdit = (membro) => {
        setEditingId(membro.id);
        setFormData({
            nome: membro.nome,
            email: membro.email,
            senha: '', // Não carregar senha por segurança
            role: membro.role || 'MEMBRO',
        });
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            nome: '',
            email: '',
            senha: 'senha123',
            role: 'MEMBRO'
        });
    };

    return (
        <div>
            <Navbar onLogout={onLogout} />
            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <h1>👥 Gestão de Membros</h1>

                {error && <div style={{ color: 'white', marginBottom: '20px', padding: '15px', background: '#dc3545', borderRadius: '4px' }}>❌ {error}</div>}

                {/* Formulário */}
                <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
                    <h3>{editingId ? 'Editar Membro (RF11)' : 'Cadastrar Novo Membro (RF10)'}</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input 
                            type="text" 
                            name="nome" 
                            placeholder="Nome Completo" 
                            value={formData.nome} 
                            onChange={handleInputChange} 
                            required 
                            style={{ padding: '8px', gridColumn: '1 / -1', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Email" 
                            value={formData.email} 
                            onChange={handleInputChange} 
                            required 
                            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                        <input 
                            type="password" 
                            name="senha" 
                            placeholder={editingId ? "Senha (deixe em branco para manter atual)" : "Senha"} 
                            value={formData.senha} 
                            onChange={handleInputChange} 
                            required={!editingId}
                            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                        <select 
                            name="role" 
                            value={formData.role} 
                            onChange={handleInputChange} 
                            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
                            <option value="MEMBRO">👤 Membro</option>
                            <option value="BIBLIOTECARIO">📚 Bibliotecário</option>
                        </select>
                        
                        <div style={{ display: 'flex', gap: '10px', gridColumn: '1 / -1', marginTop: '10px' }}>
                            <button type="submit" style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer', flex: 1, borderRadius: '4px', fontWeight: 'bold' }}>
                                {editingId ? 'Salvar Alterações' : 'Cadastrar Membro'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={resetForm} style={{ padding: '10px', background: '#6c757d', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Lista de Membros */}
                <h2>Membros Registrados ({membros.length})</h2>
                {loading && <p>⏳ Carregando...</p>}
                {!loading && membros.length === 0 && <p>Nenhum membro cadastrado</p>}

                {!loading && membros.length > 0 && (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#28a745', color: 'white' }}>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Nome</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
                                    <th style={{ padding: '10px', textAlign: 'center' }}>Role</th>
                                    <th style={{ padding: '10px', textAlign: 'center' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {membros.map(membro => (
                                    <tr key={membro.id} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '10px' }}>#{membro.id}</td>
                                        <td style={{ padding: '10px' }}>{membro.nome}</td>
                                        <td style={{ padding: '10px' }}>{membro.email}</td>
                                        <td style={{ padding: '10px', textAlign: 'center' }}>
                                            <span style={{
                                                backgroundColor: membro.role === 'BIBLIOTECARIO' ? '#dc3545' : '#28a745',
                                                color: 'white',
                                                padding: '6px 10px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}>
                                                {membro.role === 'BIBLIOTECARIO' ? '📚 Bibliotecário' : '👤 Membro'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '10px', textAlign: 'center' }}>
                                            <button onClick={() => handleEdit(membro)} style={{ marginRight: '5px', padding: '6px 10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>✏️</button>
                                            <button onClick={() => handleDelete(membro.id)} style={{ padding: '6px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MembrosPage;