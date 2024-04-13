import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { RetornoCadastroDTO, RetornoObjDTO } from "../dto/retorno.dto";
import { Formulario } from './formulario.entity'
import { v4 as uuid } from 'uuid'
import { ListaFormularioDTO } from "../dto/formulario/listaFormulario.dto";
import { FormularioDTO } from "../dto/formulario/formulario.dto";
import { AtualizarUsuarioDTO } from "../dto/usuario/atualizarUsuario.dto";

@Injectable()
export class FormularioService {

    constructor(
        @Inject('FORMULARIO_REPOSITORY')
        private formularioRepository: Repository<Formulario>
    ) { }

    async listar(): Promise<ListaFormularioDTO[]> {
        return this.formularioRepository.find();
    }

    async inserir(dados: FormularioDTO): Promise<RetornoCadastroDTO> {
        let formulario = new Formulario();
        formulario.ID = uuid()
        formulario.IMAGEM = dados.IMAGEM
        formulario.ENDERECO = dados.ENDERECO
        formulario.CIDADE = dados.CIDADE
        formulario.RACA = dados.RACA
        formulario.SEXO = dados.SEXO
        formulario.COR = dados.COR
        formulario.SAUDE = dados.SAUDE
        formulario.ACESSORIO = dados.ACESSORIO
        formulario.USUARIO = dados.USUARIO

        return this.formularioRepository.save(formulario)
            .then((result) => {
                return <RetornoCadastroDTO>{
                    id: formulario.ID,
                    message: "Cadastrado com Sucesso !"
                };
            })
            .catch((error) => {
                return <RetornoCadastroDTO>{
                    id: "",
                    message: "Houve um erro ao cadastrar." + error.message
                };
            })
    }

    localizarID(ID: string): Promise<Formulario> {
        return this.formularioRepository.findOne({
            where: {
                ID,
            },
        });
    }

    async remove(id: string): Promise<RetornoObjDTO> {
        const formulario = await this.localizarID(id);

        return this.formularioRepository.remove(formulario)
            .then((result) => {
                return <RetornoObjDTO>{
                    return: formulario,
                    message: "Formulario excluido !"
                };
            })
            .catch((error) => {
                return <RetornoObjDTO>{
                    return: formulario,
                    message: "Houve um erro ao excluir." + error.message
                };
            });
    }

    async alterar(id: string, dados: AtualizarUsuarioDTO): Promise<RetornoCadastroDTO> {
        const formulario = await this.localizarID(id);

        Object.entries(dados).forEach(
            async ([chave, valor]) => {
                if (chave === 'id') {
                    return;
                }

                formulario[chave] = valor;
            }
        )

        return this.formularioRepository.save(formulario)
            .then((result) => {
                return <RetornoCadastroDTO>{
                    id: formulario.ID,
                    message: "Formulario alterado !"
                };
            })
            .catch((error) => {
                return <RetornoCadastroDTO>{
                    id: "",
                    message: "Houve um erro ao alterar." + error.message
                };
            });
    }
}