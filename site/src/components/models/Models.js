export class Usuario {
    constructor(usuario) {
        this.id_usuario=usuario.id_usuario
        this.nome_completo=usuario.nome_completo
        this.email=usuario.email
        this.telefone=usuario.telefone
        this.senha_hash=usuario.senha_hash
        this.id_perfil=usuario.id_perfil
        this.status_usuario=usuario.status_usuario
        this.path_img=usuario.path_img
        this.descricao=usuario.descricao
        this.criado_em=usuario.criado_em
        this.atualizado_em=usuario.atualizado_em
        this.ultimo_login=usuario.ultimo_login
    }
    
}