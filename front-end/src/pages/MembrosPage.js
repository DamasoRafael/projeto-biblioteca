import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { membroService } from '../services/api'; // Usando serviço REAL

function MembrosPage() {
    const [membros, setMembros] = useState([]);
    const [formData, setFormData] = useState({ nome: '', email: '', cpf: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => { fetchMembros(); }, []);

    const fetchMembros = async () => {
        try {
            const response = await membroService.listar();
            setMembros(response.data);
        } catch (error) { console.error("Erro ao buscar membros:", error); }
    };
    
    const handleInputChange = (e) => { 
        setFormData({ ...formData, [e.target.name]: e.target.value }); 
    };

    const resetForm = () => { setEditingId(null); setFormData({ nome: '', email: '', cpf: '' }); };

    // --- LÓGICA DE CREATE/UPDATE/DELETE (RF10, RF11) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await membroService.atualizar(editingId, formData);
                alert("Membro atualizado!");
            } else {
                await membroService.salvar(formData);
                alert("Membro cadastrado!");
            }
            resetForm();
            fetchMembros();
        } catch (error) {
            console.error("Erro ao salvar membro:", error);
            alert("Erro ao salvar membro. Verifique se o Email/CPF já existem.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Deseja realmente excluir este membro?")) {
            try {
                await membroService.excluir(id);
                alert("Membro excluído.");
                fetchMembros();
            } catch (error) {
                alert("Erro ao excluir. O membro pode ter empréstimos ativos (RN-04).");
            }
        }
    };

    const handleEdit = (membro) => {
        setEditingId(membro.id);
        setFormData({ nome: membro.nome, email: membro.email, cpf: membro.cpf });
    };


    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <Link to="/dashboard">← Voltar</Link>
            <h1>Gestão de Membros (I_GestaoMembros)</h1>

            {/* Formulário (Mínimo CRUD) */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                <h3>{editingId ? 'Editar Membro (RF11)' : 'Cadastrar Membro (RF10)'}</h3>
                <input type="text" name="nome" placeholder="Nome" value={formData.nome} onChange={handleInputChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
                <input type="text" name="cpf" placeholder="CPF" value={formData.cpf} onChange={handleInputChange} required />
                <button type="submit">{editingId ? 'Salvar Alterações' : 'Cadastrar'}</button>
                {editingId && <button type="button" onClick={resetForm}>Cancelar Edição</button>}
            </form>

            {/* Lista */}
            <h2>Membros Cadastrados ({membros.length})</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {membros.map(m => (
                    <li key={m.id} style={{ borderBottom: '1px solid #eee', padding: '10px' }}>
                        <strong>{m.nome}</strong> ({m.email})
                        <button onClick={() => handleEdit(m)} style={{ marginLeft: '10px' }}>Editar (RF11)</button>
                        <button onClick={() => handleDelete(m.id)} style={{ marginLeft: '5px' }}>Excluir</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MembrosPage;