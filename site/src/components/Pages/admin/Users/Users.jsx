import { useForm } from 'react-hook-form'
import { useEffect, useState } from "react";
import { MdAdd, MdClose, MdDelete, MdEdit, MdPreview } from 'react-icons/md';
import NavBarAdmin from "../../../Elements/NavBarAdmin/NavBarAdmin";
import SideBarAdmin from "../../../Elements/SideBarAdmin/SideBarAdmin";
import style from './Users.module.css';
import { userService, permissionService } from '../../../../services/appServices';
import { GetURL } from '../../../../services/ModelServices';
import { FaEye, FaFileExcel, FaFilePdf, FaFileWord } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FiShield, FiShieldOff, FiUser } from "react-icons/fi";
import ParagrafoErro from '../../../Elements/ParagrafoErro/ParagrafoErro';
import { BiSolidUserX, BiSolidUserCheck, BiUnite } from "react-icons/bi";
import { api } from '../../../../services/api';

export default function Users() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [perfis, setPerfis] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showAction, setShowActions] = useState(false);
  const [showView, setShowView] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState({});
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [permissoesDisponiveis, setPermissoesDisponiveis] = useState([]);
  const [permissoesUsuario, setPermissoesUsuario] = useState([]);
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
        setUsuariosFiltrados(res.usuario || []);
        console.log(res.usuario);

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
        console.log("Resposta perfis:", res);
        if (res && res.sucesso) {
          // O backend retorna 'datas' não 'perfis'
          setPerfis(res.datas.perfis);
          console.log("Perfis carregados:", res.datas.perfis);
        }
      } catch (error) {
        console.error("Erro ao carregar perfis:", error);
      }
    })();
  }, []);

  // Função de pesquisa
  const handleSearch = (term) => {
    //setSearchTerm(term);

    if (!term || term.trim() === "") {
      // Se não há termo de pesquisa, mostra todos os usuários
      setUsuariosFiltrados(usuarios);
    } else {
      // Filtra usuários usando includes (case-insensitive)
      const termLower = term.toLowerCase();
      const filtrados = usuarios.filter(usuario =>
        usuario.nome_completo?.toLowerCase().includes(termLower) ||
        usuario.email?.toLowerCase().includes(termLower)
      );
      setUsuariosFiltrados(filtrados);
    }
  };

  const toggleAdd = () => setShowAdd(prev => !prev);

  const toggleActions = async (usuario = null) => {
    if (usuario && !showAction) {
      // Abrindo modal - carregar dados
      setUsuarioSelecionado(usuario);
      setShowActions(true);
      // Carregar permissões após abrir o modal
      await carregarPermissoes(usuario.id_usuario);
    } else {
      // Fechando modal - limpar dados
      setShowActions(false);
      setUsuarioSelecionado({});
      setPermissoesDisponiveis([]);
      setPermissoesUsuario([]);
    }
  };

  const toggleView = (usuario = null) => {
    if (usuario && !showView) {
      // Abrindo modal
      setUsuarioSelecionado(usuario);
      setShowView(true);
    } else {
      // Fechando modal
      setShowView(false);
      setUsuarioSelecionado({});
    }
  };

  // Carregar todas as permissões disponíveis e as do usuário
  async function carregarPermissoes(id_usuario) {
    try {
      setLoading(true);
      console.log("Carregando permissões para usuário:", id_usuario);

      // Carregar todas as permissões disponíveis
      const resPermissoes = await permissionService.list();
      console.log("Permissões disponíveis:", resPermissoes);
      if (resPermissoes && resPermissoes.sucesso) {
        setPermissoesDisponiveis(resPermissoes.permissoes || []);
      }

      // Carregar permissões do usuário
      const resUsuarioPermissoes = await permissionService.getUserPermissions(id_usuario);
      console.log("Permissões do usuário:", resUsuarioPermissoes);
      if (resUsuarioPermissoes && resUsuarioPermissoes.sucesso) {
        setPermissoesUsuario(resUsuarioPermissoes.permissoes || []);
      }
    } catch (error) {
      console.error("Erro ao carregar permissões:", error);
      alert("Erro ao carregar permissões: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  // Verificar se usuário tem uma permissão específica
  function usuarioTemPermissao(id_permissao) {
    return permissoesUsuario.some(p => p.id_permissao === id_permissao);
  }

  // Adicionar ou remover permissão
  async function togglePermissao(id_permissao) {
    if (!usuarioSelecionado || !usuarioSelecionado.id_usuario) {
      alert("Nenhum usuário selecionado!");
      return;
    }

    try {
      setLoading(true);
      const temPermissao = usuarioTemPermissao(id_permissao);

      if (temPermissao) {
        // Remover permissão
        const permissaoUsuario = permissoesUsuario.find(p => p.id_permissao === id_permissao);
        //console.log("Removendo permissão:", permissaoUsuario);
        const res = await permissionService.removeFromUser(permissaoUsuario.id_permissao_usuario);
        if (res && res.sucesso) {
          //alert("Permissão removida com sucesso!");
          // Recarregar permissões para atualizar o estado
          await carregarPermissoes(usuarioSelecionado.id_usuario);
        } else {
          //alert("Erro ao remover permissão: " + (res?.mensagem || "Erro desconhecido"));
        }
      } else {
        // Adicionar permissão
        console.log("Adicionando permissão:", { id_usuario: usuarioSelecionado.id_usuario, id_permissao });
        const res = await permissionService.assignToUser({
          id_usuario: usuarioSelecionado.id_usuario,
          id_permissao: id_permissao
        });
        if (res && res.sucesso) {
          //alert("Permissão adicionada com sucesso!");
          // Recarregar permissões para atualizar o estado
          await carregarPermissoes(usuarioSelecionado.id_usuario);
        } else {
          alert("Erro ao adicionar permissão: " + (res?.mensagem || "Erro desconhecido"));
        }
      }
    } catch (error) {
      console.error("Erro ao alterar permissão:", error);
      alert("Erro ao alterar permissão: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  // Atualizar status do usuário
  async function atualizarStatus(novoStatus) {
    try {
      setLoading(true);
      const res = await userService.update(usuarioSelecionado.id_usuario, {
        ...usuarioSelecionado,
        status_usuario: novoStatus
      });

      if (res && res.sucesso) {
        alert("Status atualizado com sucesso!");
        setUsuarioSelecionado({ ...usuarioSelecionado, status_usuario: novoStatus });
        await loadUsers();
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status.");
    } finally {
      setLoading(false);
    }
  }

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
      <SideBarAdmin onSearch={handleSearch} />
      <main className={style.containerMainUser}>
        <div className={style.containerControles}>
          <button onClick={toggleAdd}><MdAdd /> Adicionar Usuário</button>
        </div>

        <div className={style.containerContent}>

          {usuariosFiltrados.length === 0 ? (
            <div className={style.user}>
              <div className={style.info}>
                <div>
                  <div className={style.img}>

                  </div>
                  <div className={style.datas}>
                    <span className={style.nome_user}>
                      Nenhum usuário encontrado
                    </span>
                    <span className={style.email_user}>
                      Adicione um novo usuário para começar
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            usuariosFiltrados.map((usuario) => (
              <div key={usuario.id_usuario} className={style.user}>
                <div className={style.info}>
                  <div>
                    <div className={style.img}>
                      {usuario.path_img ? (
                        <img
                          src={`${api.baseUrl}${usuario.path_img}`}
                          alt={usuario.nome_completo}
                          width={50}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div style={{
                        display: usuario.path_img ? 'none' : 'flex',
                        width: '50px',
                        height: '50px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#e0e0e0',
                        borderRadius: '50%'
                      }}>
                        <FiUser size={25} color="#666" />
                      </div>
                    </div>
                    <div className={style.datas}>
                      <span className={style.nome_user}>
                        {usuario.nome_completo}
                      </span>
                      <span className={style.email_user}>
                        {usuario.email}
                      </span>

                    </div>
                  </div>
                </div>
                <div className={style.controller}>
                  <strong>{usuario.status_usuario}</strong>
                  <button onClick={() => toggleView(usuario)}><FaEye /></button>
                  <button onClick={() => toggleActions(usuario)}>   <FiShield /> </button>
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
            <MdClose onClick={() => toggleView(null)} />
          </div>

          <div className={style.userHeader}>
            <div className={style.avatar}>
              {usuarioSelecionado?.path_img ? (
                <img
                  src={`${api.baseUrl}${usuarioSelecionado.path_img}`}
                  alt={usuarioSelecionado.nome_completo}
                  style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                />
              ) : null}
              <FiUser size={35} style={{ display: usuarioSelecionado?.path_img ? 'none' : 'block' }} />
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
                <span>Status</span>
                <select
                  value={usuarioSelecionado?.status_usuario || "Activo"}
                  onChange={(e) => atualizarStatus(e.target.value)}
                  disabled={loading}
                  style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inativo">Inativo</option>
                  <option value="Banido">Banido</option>
                </select>
              </div>
              <div className={style.permissionRow}>
                <span>Ultimo Login</span>
                <span>{usuarioSelecionado?.ultimo_login ? new Date(usuarioSelecionado.ultimo_login).toLocaleDateString('pt-PT') : "-"}</span>
              </div>
              <div className={style.permissionRow}>
                <span>Ultima Actualização</span>
                <span>{usuarioSelecionado?.atualizado_em ? new Date(usuarioSelecionado.atualizado_em).toLocaleDateString('pt-PT') : "-"}</span>
              </div>
              <div className={style.permissionRow}>
                <span>Data Criação</span>
                <span>{usuarioSelecionado?.criado_em ? new Date(usuarioSelecionado.criado_em).toLocaleDateString('pt-PT') : "-"}</span>
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

      {/* Modal Permissões */}
      <div className={`${style.containerActions} ${showAction ? style.showDisplayTrueActions : style.showDisplayFalseActions}`}>
        <div className={style.cardFormActions}>
          <div className={style.cardClose}>
            <MdClose onClick={() => toggleActions(null)} />
          </div>
          <div className={style.userHeader}>
            <div className={style.avatar}>
              {usuarioSelecionado?.path_img ? (
                <img
                  src={`${api.baseUrl}${usuarioSelecionado.path_img}`}
                  alt={usuarioSelecionado.nome_completo}
                  style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                />
              ) : null}
              <FiUser size={35} style={{ display: usuarioSelecionado?.path_img ? 'none' : 'block' }} />
            </div>

            <div>
              <h2>{usuarioSelecionado?.nome_completo || "Selecione um usuário"}</h2>
              <p>{usuarioSelecionado?.email || ""}</p>
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

              {loading ? (
                <p>Carregando permissões...</p>
              ) : permissoesDisponiveis.length > 0 ? (
                permissoesDisponiveis.map((permissao) => (
                  <div key={permissao.id_permissao} className={style.permissionRow}>
                    <span>{permissao.permissao}</span>

                    <label className={style.switch}>
                      <input
                        type="checkbox"
                        checked={usuarioTemPermissao(permissao.id_permissao)}
                        onChange={() => togglePermissao(permissao.id_permissao)}
                        disabled={loading}
                      />
                      <span className={style.slider}></span>
                    </label>
                  </div>
                ))
              ) : (
                <p>Nenhuma permissão disponível</p>
              )}

            </div>
          </div>

        </div>
      </div >

    </>
  );
}
