import { useState, useEffect, useRef } from 'react';
import NavBarAdmin from '../../../Elements/NavBarAdmin/NavBarAdmin';
import { FiMail, FiPhone, FiMapPin, FiUser, FiCamera, FiSave, FiX, FiEdit3 } from "react-icons/fi";
import style from './Account.module.css';
import { useAuth } from '../../../../contexts/AuthContext';
import { GetURL } from '../../../../services/ModelServices';
import { userService } from '../../../../services/appServices';

export default function Account() {
  const { user, refreshUser } = useAuth();
  const URL = GetURL();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        nome_completo: user.nome_completo || user.nome || '',
        email: user.email || '',
        telefone: user.telefone || '',
        descricao: user.descricao || '',
        // Preserving other fields
        id_perfil: user.id_perfil,
        path_img: user.path_img
      });
      setImagePreview(null);
      setSelectedFile(null);
    }
  }, [user, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let finalPathImg = formData.path_img;

      // 1. Upload da imagem se houver nova
      if (selectedFile) {
        const uploadRes = await userService.upload(selectedFile);
        if (uploadRes && uploadRes.sucesso) {
          finalPathImg = uploadRes.path; // Caminho retornado pelo backend
        } else {
            console.error("Falha no upload da imagem");
           // Poderíamos alertar o usuário aqui
        }
      }

      // 2. Atualizar dados do usuário
      const dataToUpdate = {
        ...formData,
        path_img: finalPathImg
      };

      const updateRes = await userService.update(user.id_usuario, dataToUpdate);

      if (updateRes && (updateRes.sucesso || updateRes.status === 200)) {
        await refreshUser(); // Atualiza o contexto
        setIsEditing(false);
        // Opcional: Mostrar toast de sucesso
      } else {
        console.error("Erro ao atualizar perfil:", updateRes);
        // Opcional: Mostrar toast de erro
      }

    } catch (error) {
      console.error("Erro crítico ao salvar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <>
        <NavBarAdmin />
        <div className={style.container}>
            <div className={style.loadingState}>
                <p>Carregando dados do usuário...</p>
            </div>
        </div>
      </>
    );
  }

  // Determinar a imagem a ser mostrada (Preview > User Image > Placeholder)
  const currentImage = imagePreview 
    ? imagePreview 
    : (user.path_img ? 
        (user.path_img.startsWith('http') ? user.path_img : `${URL}${user.path_img}`) 
        : null);

  return (
    <>
      <NavBarAdmin />

      <div className={style.container}>
        <div className={style.profileCard}>
            {/* Header / Avatar */}
            <div className={style.header}>
                <div 
                    className={`${style.avatar} ${isEditing ? style.editableAvatar : ''}`} 
                    onClick={handleImageClick}
                    title={isEditing ? "Clique para alterar a foto" : ""}
                >
                    {currentImage ? (
                        <img src={currentImage} alt="Foto do usuário" />
                    ) : (
                        <FiUser size={40} className={style.avatarIcon} />
                    )}
                    
                    {isEditing && (
                        <div className={style.cameraOverlay}>
                            <FiCamera size={24} />
                        </div>
                    )}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        style={{ display: 'none' }} 
                        accept="image/*"
                    />
                </div>

                <div className={style.headerInfo}>
                    {isEditing ? (
                        <input
                            type="text"
                            name="nome_completo"
                            className={style.inputTitle}
                            value={formData.nome_completo}
                            onChange={handleInputChange}
                            placeholder="Seu Nome Completo"
                        />
                    ) : (
                        <h2>{user.nome_completo || user.nome}</h2>
                    )}
                    <p>{user.email}</p>
                </div>

                <div className={style.actions}>
                    {!isEditing ? (
                        <button className={style.btnEdit} onClick={() => setIsEditing(true)}>
                            <FiEdit3 /> Editar Perfil
                        </button>
                    ) : (
                        <div className={style.editGroup}>
                            <button className={style.btnCancel} onClick={() => setIsEditing(false)} disabled={loading}>
                                <FiX /> Cancelar
                            </button>
                            <button className={style.btnSave} onClick={handleSave} disabled={loading}>
                                <FiSave /> {loading ? 'Salvando...' : 'Salvar'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className={style.divider}></div>

            {/* Informations Section */}
            <div className={style.section}>
                <h3>Informações Pessoais</h3>

                {/* Email - Usually Read Only */}
                <div className={style.infoLine}>
                    <FiMail title="E-mail" />
                    <div className={style.infoContent}>
                        <label>E-mail</label>
                        <span>{formData.email}</span>
                         {/* Se quiser permitir editar email, transforme em input. Geralmente email é chave de login e requer cuidado. */}
                    </div>
                </div>

                {/* Telefone */}
                <div className={style.infoLine}>
                    <FiPhone title="Telefone" />
                    <div className={style.infoContent}>
                        <label>Telefone</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="telefone"
                                className={style.inputField}
                                value={formData.telefone}
                                onChange={handleInputChange}
                                placeholder="Seu telefone"
                            />
                        ) : (
                            <span>{user.telefone || 'Não informado'}</span>
                        )}
                    </div>
                </div>

                {/* Descrição / Bio */}
                <div className={style.infoLine}>
                 <FiUser title="Sobre" />
                  <div className={style.infoContent}>
                    <label>Sobre Mim</label>
                    {isEditing ? (
                      <textarea
                        name="descricao"
                        className={style.textareaField}
                        value={formData.descricao}
                        onChange={handleInputChange}
                        placeholder="Escreva algo sobre você..."
                        rows={3}
                      />
                    ) : (
                      <span>{user.descricao || 'Nenhuma descrição fornecida.'}</span>
                    )}
                  </div>
                </div>

                {/* Perfil (Read Only) */}
                <div className={style.infoLine}>
                    <FiMapPin title="Cargo" /> {/* Usando icone placeholder se não tiver outro melhor */}
                    <div className={style.infoContent}>
                        <label>Tipo de Conta</label>
                        <span className={style.badge}>
                            Administrador {/* Mapear ID se necessário, mas geralmente admins sabem o q são */}
                        </span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}
