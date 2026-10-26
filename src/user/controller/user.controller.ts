import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { GetUserService } from "../services/getUser/service/getUser.service.js";
import { PostUserService } from "../services/postUser/service/postUser.service.js";
import { PutUserService } from "../services/putUser/service/putUser.service.js";
import { DeleteUserService } from "../services/deleteUser/service/deleteUser.service.js";
import { GetUserDataDTO } from "../services/getUser/dto/getUserData.dto.js";
import { GetUserInputDTO } from "../services/getUser/dto/getUserInput.dto.js";
import { PostUserInputDTO } from "../services/postUser/dto/postUserInput.dto.js";
import { PostUserOutputDTO } from "../services/postUser/dto/postUserOutput.dto.js";
import { PutUserInputDTO } from "../services/putUser/dto/putUserInput.dto.js";
import { DeleteUserInputDTO } from "../services/deleteUser/dto/deleteUserInput.dto.js";
import { GetUserOutputDTO } from "../services/getUser/dto/getUserOutput.dto.js";

@ApiTags('Users')
@Controller('user')
export class UserController{
    constructor(
        private readonly getUserService: GetUserService,
        private readonly postUserService: PostUserService,
        private readonly putUserService: PutUserService,
        private readonly deleteUserService: DeleteUserService,
    ){}

    @Get()
    @ApiOperation({ summary: 'Lista os usuários (sem a senha, com o cpf legivel)' })
    @ApiOkResponse({
        description: 'Lista de usuários',
        type: GetUserDataDTO,
        isArray: true,
    })
    @ApiBadRequestResponse({ description: 'page ou size ausente ou invalido'})
    async getUser(@Query() data: GetUserInputDTO): Promise<GetUserOutputDTO> {
        return await this.getUserService.execute(data)
    }

    @Post()
    @ApiOperation({
        summary: 'Cadastra um usuário (senha em hash, CPF criptografado)',
    })
    @ApiBody({ type: PostUserInputDTO})
    @ApiCreatedResponse({
        description: 'Usuário criado; devolde o id gerado',
        type: PostUserInputDTO,
    })
    @ApiBadRequestResponse({
        description: 'Dados inválidos, usuário ou e-mail já cadastrado'
    })
    @ApiInternalServerErrorResponse({
        description: 'DATA_ENCRYPTION_KEY ausente ou invalida no .env'
    })
    async postUser(@Body() data: PostUserInputDTO): Promise<PostUserOutputDTO> {
        return await this.postUserService.execute(data)
    }

    @Put(':user_id')
    @ApiOperation({summary: 'Altera os campos enviados de um usuário'})
    @ApiBody({ type: PutUserInputDTO})
    @ApiOkResponse({ description: 'Usuário alterado'})
    @ApiBadRequestResponse({
        description: 'Dados inválidos, usuário ou e-mail já usado por outro usuário'
    })
    @ApiNotFoundResponse({ description: 'Usuário não encontrado'})
    async putUser(
        @Param('user_id', ParseIntPipe) user_id: number,
        @Body() data: PutUserInputDTO,
    ): Promise<void> {
        data.user_id = user_id
        return await this.putUserService.execute(data);
    }

    @Delete(':user_id')
    @ApiOperation({ summary: 'Remove um usuário'})
    @ApiOkResponse({ description: 'Usuário removido' })
    @ApiForbiddenResponse({description: 'Usuário protegido (o admin, id 1)'})
    @ApiNotFoundResponse({ description: 'Usuário não encontrado'})
    async deleteUser(@Param() data: DeleteUserInputDTO): Promise<void> {
        return await this.deleteUserService.execute(data)
    }
}