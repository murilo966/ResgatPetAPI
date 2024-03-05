import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { AtualizarUsuarioDTO } from '../dto/usuario/atualizarUsuario.dto';
import { UsuarioDTO } from '../dto/usuario/usuario.dto';
import { UsuarioArmazenados } from './usuario.dm';
import { ListaUsuarioDTO } from '../dto/usuario/listaUsuario.dto';
import { UsuarioEntity } from './usuario.entity';
import { v4 as uuid } from 'uuid'
import { LoginUsuarioDTO } from '../dto/usuario/loginUsuario.dto';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('usuario')
@Controller('usuarios')
export class UsuarioController {

    constructor(private clsUsuarioArmazenados: UsuarioArmazenados){}

    @ApiResponse({ status: 200, description: 'Retorna os usuários cadastrados.'})
    @Get()
    async RetornoUsuarios(){
        const usuarioListados = await this.clsUsuarioArmazenados.Usuarios;
        const listaRetorno = usuarioListados.map(
            usuario => new ListaUsuarioDTO(
                usuario.id,
                usuario.nome,
                usuario.cpf_cnpj,
                usuario.telefone,
                usuario.email,
                usuario.senha,
                usuario.foto,
                usuario.level
            )
        );
        
        return listaRetorno;
    }

    @ApiCreatedResponse({ status: 200, description: 'Retorna que houve sucesso ao cadastrar o usuário e retorna o ID criado.'})
    @Post()
    async CriaUsuario(@Body() dadosUsuario: UsuarioDTO){
        var usuario = new UsuarioEntity(
            uuid(),
            dadosUsuario.nome,
            dadosUsuario.cpf_cnpj,
            dadosUsuario.telefone,
            dadosUsuario.email,
            dadosUsuario.senha,
            dadosUsuario.foto,
            dadosUsuario.level
        )        
            
        this.clsUsuarioArmazenados.AdicionarUsuario(usuario);        
        var retorno={
            id: usuario.id,
            message:'Usuario Criado =)',
            status:200
        }
        
        return retorno
    }

    @ApiResponse({ status: 200, description: 'Retorna se houve sucesso no login. O retorno "Status" diz se houve sucesso ou não.'})
    @Post('/login')
    async Login(@Body() dadosUsuario: LoginUsuarioDTO){
        var login = this.clsUsuarioArmazenados.validarLogin( dadosUsuario.email,dadosUsuario.senha)
        return{
            usuario: login[1] ? login[0] : null,
            status: login[1],
            message: login[1] ? "Login Efetuado" : "Usuario ou senha invalidos !"
        }
    }

    @ApiResponse({ status: 200, description: 'Retorna que houve sucesso ao alterar o usuário.'})
    @ApiResponse({ status: 500, description: 'Retorna que o usuário não foi encontrado.'})
    @Put('/:id')
    async atualizaUsuario(@Param('id') id: string, @Body() novosDados: AtualizarUsuarioDTO){
        const usuarioAtualizado = await this.clsUsuarioArmazenados.atualizaUsuario(id, novosDados)

        return{
            usuario: usuarioAtualizado,
            message: 'Usuario Atualizado com Sucesso ! ;)',
            status:200
        }
    }

    @ApiCreatedResponse({ status: 200, description: 'Retorna que houve sucesso ao remover o usuário.'})
    @Delete('/:id')
    async removeUsuario(@Param('id') id: string){
        const usuarioRemovido = await this.clsUsuarioArmazenados.removeUsuario(id)

        return{
            usuario: usuarioRemovido,
            message: 'Usuario removido com Sucesso :S',
            status:200
        }
    }

    @ApiResponse({ status: 200, description: 'Retorna que houve sucesso ao trocar a foto.'})
    @ApiResponse({ status: 500, description: 'Retorna que a foto não foi encontrado.'})
    @Post('/foto/:id')
    async atualizaFoto(@Param('id') id: string,@Body() AlteraFotoUsuarioDTO){
        const usuario = await this.clsUsuarioArmazenados.atualizaUsuario(id,AlteraFotoUsuarioDTO)

        return{
            usuario: usuario,
            status:200
        }
    }
}

