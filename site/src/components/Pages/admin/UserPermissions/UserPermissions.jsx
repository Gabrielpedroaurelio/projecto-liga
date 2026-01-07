import { FiUser, FiShield } from "react-icons/fi";
import style from "./UserPermissions.module.css";
import { useEffect, useMemo, useState } from "react";
import { userService, permissionService } from "../../../../services/appServices";

export default function UserPermissions() {
  const [usuarios, setUsuarios] = useState([]);
  const [permissoes, setPermissoes] = useState([]);
  const [permissoesUsuarios, setPermissoesUsuarios] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [resUsers, resPerms, resUserPerms] = await Promise.all([
          userService.list(),
          permissionService.list(),
          permissionService.listUserPermissions(),
        ]);

        if (resUsers && resUsers.sucesso) {
          const listUsers = resUsers.usuario || [];
          setUsuarios(listUsers);
          if (listUsers.length > 0) setSelectedUserId(listUsers[0].id_usuario);
        }

        if (resPerms && resPerms.sucesso) {
          setPermissoes(resPerms.permissoes || []);
        }

        if (resUserPerms && resUserPerms.sucesso) {
          setPermissoesUsuarios(resUserPerms.permissoes_usuarios || []);
        }

      } catch (error) {
        console.error("Erro ao carregar permissões:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const selectedUser = useMemo(
    () => usuarios.find((u) => u.id_usuario === selectedUserId) || null,
    [usuarios, selectedUserId]
  );

  const permissoesAtivasDoUsuario = useMemo(
    () =>
      permissoesUsuarios.filter(
        (pu) => pu.id_usuario === selectedUserId
      ),
    [permissoesUsuarios, selectedUserId]
  );

  function isActive(id_permissao) {
    return permissoesAtivasDoUsuario.some(
      (p) => p.id_permissao === id_permissao
    );
  }

  async function togglePermissao(id_permissao) {
    if (!selectedUserId) return;

    const existente = permissoesAtivasDoUsuario.find(
      (p) => p.id_permissao === id_permissao
    );

    try {
      if (existente) {
        // Se já existe, remover
        const res = await permissionService.removeFromUser(existente.id_permissao_usuario);
        if (res && res.sucesso) {
          setPermissoesUsuarios((prev) =>
            prev.filter((p) => p.id_permissao_usuario !== existente.id_permissao_usuario)
          );
        }
      } else {
        // Se não existe, criar
        const payload = {
          id_usuario: selectedUserId,
          id_permissao,
        };
        const res = await permissionService.assignToUser(payload);
        if (res && res.sucesso) {
          setPermissoesUsuarios((prev) => [
            ...prev,
            {
              id_permissao_usuario: res.permissao_usuario.id_permissao_usuario,
              id_usuario: selectedUserId,
              id_permissao,
              permissao: permissoes.find((p) => p.id_permissao === id_permissao)?.permissao,
              nome_completo: selectedUser?.nome_completo,
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Erro ao alternar permissão:", error);
    }
  }

  if (loading) {
    return <div className={style.container}>Carregando permissões...</div>;
  }

  return (
    <div className={style.container}>
      <div className={style.userHeader}>
        <div className={style.avatar}>
          <FiUser size={35} />
        </div>

        <div>
          <h2>{selectedUser?.nome_completo || "Selecione um usuário"}</h2>
          <p>{selectedUser?.email || ""}</p>
        </div>

        <div style={{ marginLeft: "auto" }}>
          <select
            value={selectedUserId || ""}
            onChange={(e) => setSelectedUserId(Number(e.target.value))}
          >
            {usuarios.map((u) => (
              <option key={u.id_usuario} value={u.id_usuario}>
                {u.nome_completo}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={style.pageTitle}>
        <FiShield /> Gestão de Permissões
      </div>

      <div className={style.permissionsPanel}>
        <div className={style.permissionSection}>
          <h3>Permissões disponíveis</h3>

          {permissoes.map((perm) => (
            <div key={perm.id_permissao} className={style.permissionRow}>
              <span>{perm.permissao}</span>

              <label className={style.switch}>
                <input
                  type="checkbox"
                  checked={isActive(perm.id_permissao)}
                  onChange={() => togglePermissao(perm.id_permissao)}
                />
                <span className={style.slider}></span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
