export class UsuarioEntity {
    id: string;
    nome: string;
    cpf_cnpj: number;
    telefone: number;
    email: string;
    senha: string;

    constructor(id: string, nome: string, cpf_cnpj: number, telefone: number, email: string, senha: string) {
        this.id = id;
        this.nome = nome;
        this.cpf_cnpj = cpf_cnpj;
        this.telefone = telefone;
        this.email = email;
        this.senha = senha;
    }
}
