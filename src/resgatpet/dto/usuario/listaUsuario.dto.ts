export class ListaUsuarioDTO{
    constructor(
        readonly ID: string,        
        readonly NOMECOMPLETO: string,
        readonly CPF_CNPJ: string,
        readonly TELEFONE: string,
        readonly EMAIL: string,
        readonly SENHA: string,
        readonly LEVEL: string
        ){}
}