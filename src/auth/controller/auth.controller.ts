import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { PostLoginService } from "../services/postLogin/service/postLogin.service.js";
import { PostLoginInputDTO } from "../services/postLogin/dto/postLoginInput.dto.js";
import { PostLoginOutputDTO } from "../services/postLogin/dto/postLoginOutput.dto.js";

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly postLoginService: PostLoginService){}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Faz login com usuário e senha e devolve um JWT'})
    @ApiBody({ type: PostLoginInputDTO})
    @ApiOkResponse({
        description: 'Login feito; use o access_token no botão Authorize',
        type: PostLoginOutputDTO,
    })
    @ApiBadRequestResponse({ description: 'username ou password ausente' })
    @ApiUnauthorizedResponse({ description: 'Usuário ou senha inválidos'})
    async postLogin(@Body() data: PostLoginInputDTO): Promise<PostLoginOutputDTO> {
        return await this.postLoginService.execute(data);
    }
}