import { useForm } from 'react-hook-form'
import { useEffect, useState } from "react";
import { MdAdd, MdClose, MdDelete, MdEdit, MdPreview } from 'react-icons/md';
import NavBarAdmin from "../../../Elements/NavBarAdmin/NavBarAdmin";
import SideBarAdmin from "../../../Elements/SideBarAdmin/SideBarAdmin";
import pessoa from '../../../../assets/_images/people02.png';
import style from './Users.module.css';
import { userService } from '../../../../services/appServices';
import { GetURL } from '../../../../services/ModelServices';
import { FaEye, FaFileExcel, FaFilePdf, FaFileWord } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FiShield, FiShieldOff, FiUser } from "react-icons/fi";
import ParagrafoErro from '../../../Elements/ParagrafoErro/ParagrafoErro';
import { BiSolidUserX, BiSolidUserCheck, BiUnite } from "react-icons/bi";

export default function Users({ usuarioLogado }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const [usuarios, setUsuarios] = useState([]);
  const [perfis, setPerfis] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showAction, setShowActions] = useState(false);
  const [showView, setShowView] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState({});
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const URLs = GetURL();

  // Carregar usuários
  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      console.log("Carregando usuários...");
      const res = await userService.list();
      if (res && res.sucesso) {
        console.log(res.msm);
        setUsuarios(res.usuario || []);
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  }

  // Carregar Perfil
  useEffect(() => {
    (async () => {
      try {
        console.log("Carregando perfis...");
        const res = await userService.getProfiles();
        if (res && res.sucesso && res.datas) {
          setPerfis(res.datas || []);
        }
      } catch (error) {
        console.error("Erro ao carregar perfis:", error);
      }
    })();
  }, []);

  const toggleAdd = () => setShowAdd(prev => !prev);
  const toggleActions = () => setShowActions(prev => !prev);
  const toggleView = (usuario = null) => {
    setUsuarioSelecionado(usuario);
    setShowView(prev => !prev);
  };

  async function CadastrarUsuario(data) {
    try {
      console.log("Cadastrando usuário:", data);
      let payload = { ...data };

      // Se houver arquivo selecionado, faz upload antes
      if (file) {
        setUploadStatus("Enviando imagem...");
        const uploadResponse = await userService.upload(file); // Usando userService que agora tem upload
        if (uploadResponse && uploadResponse.sucesso) {
          payload = {
            ...payload,
            path_img: uploadResponse.path, // Ajustado para case correto do backend
          };
          setUploadStatus("Imagem enviada!");
        }
      }
      delete payload.avatar; // Remove FileList do payload

      const response = await userService.create(payload);
      if (response && response.sucesso) {
        alert(response.msm || "Usuário cadastrado com sucesso!");
        reset();
        setFile(null);
        setShowAdd(false);
        loadUsers(); // Recarrega a lista
      } else {
        alert(response?.msm || "Erro ao cadastrar usuário.");
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert("Erro ao conectar com o servidor.");
    }
  }

  {
    /**
     * Fim da Funcao para manipular os formulario de cadastramento se usuario
     */
  }
  return (
    <>
      <NavBarAdmin />
      <SideBarAdmin />
      <main className={style.containerMainUser}>
        <div className={style.containerControles}>
          <button onClick={toggleAdd}><MdAdd /> Adicionar Usuário</button>
        </div>

        <div className={style.containerContent}>

          {usuarios.length <= 0 ? (
            <div className={style.user}>
              <div className={style.info}>
                <div>
                  <div className={style.img}>
                    <img src={pessoa} alt="" width={50} />
                  </div>
                  <div className={style.datas}>
                    <span className={style.nome_user}>
                      {"Gabriel Pedro Aurelio"}
                    </span>
                    <span className={style.email_user}>
                      {"gabrielpedroaurelio@gmail.com"}
                    </span>
                  </div>
                </div>
              </div>
              <div className={style.controller}>
                <strong>{"Activo"}</strong>
                <button onClick={toggleActions} title='Ver Permissões'><FiShield /></button>
                <button onClick={toggleView} title='Visualizar Usuario'><FaEye /></button>


              </div>
            </div>
          ) : (
            usuarios.map((usuario) => (
              <div key={usuario.id_usuario} className={style.user}>
                <div className={style.info}>
                  <div>
                    <div className={style.img}>
                      <img src={usuario.path_img} alt="" width={50} />
                    </div>
                    <div className={style.datas}>
                      <span className={style.nome_user}>
                        {usuario.nome_completo}
                      </span>
                      <span className={style.email_user}>
                        {usuario.email}
                      </span>
                      <button> <Link to="/admin/permissao"><FiShield /> Ver Permissões</Link> </button>
                    </div>
                  </div>
                </div>
                <div className={style.controller}>
                  <strong>{usuario.status_usuario}</strong>
                  <button onClick={toggleActions}><MdEdit /></button>
                  <button onClick={toggleView}><FaEye /></button>


                </div>
              </div>
            ))
          )}
        </div>
      </main>


      {/* Modal Adicionar */}
      <div className={`${style.containerAdd} ${showAdd ? style.showDisplayTrueAdd : style.showDisplayFalseAdd}`}>
        <div className={style.cardFormAdd}>
          <div className={style.cardClose}>
            <MdClose onClick={toggleAdd} />
          </div>
          <form method="post" onSubmit={handleSubmit(CadastrarUsuario)}>
            <div>
              <h2>
                Cadastrar Usuario
              </h2>
            </div>
            <div className={style.controllerInput}>
              <label htmlFor="nome_completo">Nome</label>
              <input type="text" name="nome_completo" {...register("nome_completo", {
                required: "Este campo é obrigatorio"
              })} />
              {

                errors ? (
                  <ParagrafoErro error={errors.nome_completo?.message} />
                ) : (
                  <span></span>
                )
              }
            </div>
            <div className={style.controllerInput}>
              <label htmlFor="email">E-mail</label>
              <input type="email" name="email" {...register("email", {
                required: "Este campo é obrigatorio"
              })} />
              {

                errors ? (
                  <ParagrafoErro error={errors.email?.message} />
                ) : (
                  <span></span>
                )
              }

            </div>
            <div className={style.controllerInput}>
              <label htmlFor="perfil">Tipo de Usuario</label>
              <select name="" id="" {...register("id_perfil", {
                required: "Este campo é obrigatorio"
              })}>
                {
                  perfis.length > 0 ? (
                    perfis.map((perfil) => (
                      <option value={perfil.id_perfil} key={perfil.id_perfil}>{perfil
                        .nome}</option>
                    ))
                  ) : (
                    <option value="">Sem Perfis Encotrados</option>
                  )


                }
              </select>
            </div>
            <div className={style.controllerInput}>
              <label htmlFor="senha_hash">Senha</label>
              <input type="password" name="senha_hash" {...register("senha_hash", {
                required: "Este campo é obrigatorio"
              })} />
              {
                errors ? (
                  <ParagrafoErro error={errors.senha_hash?.message} />
                ) : (
                  <span></span>
                )
              }

            </div>
            <div className={style.controllerInput}>
              <label htmlFor="telefone">Telefone</label>
              <input type="tel" name="telefone" {...register("telefone", {
                required: "Este campo é obrigatorio"
              })} />
              {

                errors ? (
                  <ParagrafoErro error={errors.telefone?.message} />
                ) : (
                  <span></span>
                )
              }

            </div>
            <div className={style.controllerInput}>
              <label htmlFor="avatar">Foto (opcional)</label>
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={(e) => {
                  const selected = e.target.files && e.target.files[0];
                  setFile(selected || null);
                  setUploadStatus("");
                }}
              />
              {uploadStatus && (
                <small className={style.uploadStatus}>{uploadStatus}</small>
              )}
            </div>
            <div className={style.controllerInput}>
              <input type="submit" value="Adicionar" />
            </div>
          </form>
        </div>
      </div>

      {/* Modal Visualizar */}
      <div className={`${style.containerVisualizar} ${showView ? style.showDisplayTrueVisualizar : style.showDisplayFalseVisualizar}`}>
        <div className={style.cardUser}>
          <div className={style.cardClose}>
            <MdClose onClick={toggleView} />
          </div>

          <div className={style.userHeader}>
            <div className={style.avatar}>
              <FiUser size={35} />
            </div>

            <div>
              <h2>{usuarioSelecionado?.nome_completo}</h2>
              <p>{usuarioSelecionado?.email}</p>
            </div>

            <div style={{ marginLeft: "auto" }}>

            </div>
          </div>

          <div className={style.pageTitle}>
            <BiUnite /> Gestão dos Usuarios
          </div>

          <div className={style.permissionsPanel}>
            <div className={style.permissionSection}>
              <h3>Dados do Usuarios</h3>

              <div className={style.permissionRow}>
                <span>Email</span>
                <span>{usuarioSelecionado?.email}</span>
              </div>
              <div className={style.permissionRow}>
                <span>Telefone</span>
                <span>{usuarioSelecionado?.telefone}</span>
              </div>
              <div className={style.permissionRow}>
                <span>Perfil</span>
                <span>{Array.isArray(perfis) && perfis.find(p => p.id_perfil === usuarioSelecionado?.id_perfil)?.nome || "N/A"}</span>
              </div>
              <div className={style.permissionRow}>
                <span>status</span>
                <span>{usuarioSelecionado?.status_usuario}</span>
              </div>
              <div className={style.permissionRow}>
                <span>Ultimo Login</span>
                <span>{usuarioSelecionado?.ultimo_login ? new Date(usuarioSelecionado.ultimo_login).toLocaleDateString() : "-"}</span>

              </div>
              <div className={style.permissionRow}>
                <span>Ultima Actualização</span>
                <span>{usuarioSelecionado?.atualizado_em ? new Date(usuarioSelecionado.atualizado_em).toLocaleDateString() : "-"}</span>

              </div>
              <div className={style.permissionRow}>
                <span>Data Criação</span>
                <span>{usuarioSelecionado?.criado_em ? new Date(usuarioSelecionado.criado_em).toLocaleDateString() : "-"}</span>
              </div>
              <div className={style.permissionRow}>
                <p>
                  <span>Descricao</span>

                  <span>
                    {usuarioSelecionado?.descricao || "Sem descrição."}
                  </span>
                </p>
              </div>
              <div className={style.permissionRow}>
                <span>Exportar como</span>
                <button><FaFileExcel /> Excel</button>
              </div>
              <div className={style.permissionRow}>
                <span>Exportar como </span>
                <button><FaFilePdf /> PDF</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Editar */}
      <div className={`${style.containerActions} ${showAction ? style.showDisplayTrueActions : style.showDisplayFalseActions}`}>
        <div className={style.cardFormActions}>
          <div className={style.cardClose}>
            <MdClose onClick={toggleActions} />
          </div>
          <div className={style.userHeader}>
            <div className={style.avatar}>
              <FiUser size={35} />
            </div>

            <div>
              <h2>{null || "Selecione um usuário"}</h2>
              <p>{null || ""}</p>
            </div>

            <div style={{ marginLeft: "auto" }}>

            </div>
          </div>

          <div className={style.pageTitle}>
            <FiShield /> Gestão de Permissões
          </div>

          <div className={style.permissionsPanel}>
            <div className={style.permissionSection}>
              <h3>Permissões disponíveis</h3>


              <div className={style.permissionRow}>
                <span>{"Permissao"}</span>

                <label className={style.switch}>
                  <input
                    type="checkbox"
                  //checked={true}
                  />
                  <span className={style.slider}></span>
                </label>
              </div>

            </div>
            <div>
              <button className={style.saveBtn}>Salvar</button>
            </div>
          </div>

        </div>
      </div >

    </>
  );
}
