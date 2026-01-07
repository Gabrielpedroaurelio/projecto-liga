import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import NavBarAdmin from "../../../Elements/NavBarAdmin/NavBarAdmin";
import SideBarAdmin from "../../../Elements/SideBarAdmin/SideBarAdmin";
import style from './Category.module.css';
import { FaPlus, FaPen, FaTrash } from 'react-icons/fa6';
import { categoryService } from '../../../../services/appServices';

export default function Category() {
    const [categorias, setCategorias] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const { register, handleSubmit, reset, setValue } = useForm();

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const res = await categoryService.list();
            if (res && res.sucesso) {
                setCategorias(res.categorias || []);
            }
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
        }
    };

    const handleAdd = () => {
        setEditingCategory(null);
        reset({ categoria: '', descricao: '' });
        setShowModal(true);
    };

    const handleEdit = (cat) => {
        setEditingCategory(cat);
        setValue('categoria', cat.categoria);
        setValue('descricao', cat.descricao);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (confirm("Tem certeza que deseja excluir esta categoria?")) {
            try {
                const res = await categoryService.delete(id);
                if (res && res.sucesso) {
                    alert("Categoria excluída!");
                    loadCategories();
                } else {
                    alert("Erro ao excluir. Verifique se existem sinais vinculados.");
                }
            } catch (error) {
                console.error("Erro ao excluir:", error);
            }
        }
    };

    const onSubmit = async (data) => {
        try {
            let res;
            if (editingCategory) {
                res = await categoryService.update(editingCategory.id_categoria, data);
            } else {
                res = await categoryService.create(data);
            }

            if (res && res.sucesso) {
                alert(editingCategory ? "Categoria atualizada!" : "Categoria criada!");
                setShowModal(false);
                loadCategories();
            }
        } catch (error) {
            console.error("Erro ao salvar:", error);
        }
    };

    return (
        <>
            <NavBarAdmin />
            <SideBarAdmin /> {/* Assuming this is the search bar/top bar component */}
            <main className={style.containerCategory}>
                <div className={style.header}>
                    <h1>Gerir Categorias</h1>
                    <button className={style.btnAdd} onClick={handleAdd}>
                        <FaPlus /> Nova Categoria
                    </button>
                </div>

                <div className={style.listCategories}>
                    {categorias.map(cat => (
                        <div key={cat.id_categoria} className={style.cardCategory}>
                            <h3>{cat.categoria}</h3>
                            <p>{cat.descricao || "Sem descrição"}</p>
                            <div className={style.actions}>
                                <button className={style.btnEdit} onClick={() => handleEdit(cat)}>
                                    <FaPen /> Editar
                                </button>
                                <button className={style.btnDelete} onClick={() => handleDelete(cat.id_categoria)}>
                                    <FaTrash /> Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                    {categorias.length === 0 && <p>Nenhuma categoria encontrada.</p>}
                </div>

                {showModal && (
                    <div className={style.modal}>
                        <div className={style.modalContent}>
                            <h2>{editingCategory ? "Editar Categoria" : "Nova Categoria"}</h2>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className={style.formGroup}>
                                    <label>Nome da Categoria</label>
                                    <input {...register('categoria', { required: true })} />
                                </div>
                                <div className={style.formGroup}>
                                    <label>Descrição</label>
                                    <textarea {...register('descricao')} rows={3} />
                                </div>
                                <div className={style.modalActions}>
                                    <button type="button" className={style.btnCancel} onClick={() => setShowModal(false)}>Cancelar</button>
                                    <button type="submit" className={style.btnSave}>Salvar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}
