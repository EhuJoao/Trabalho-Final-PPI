import express from "express"
import session from "express-session"
import cookieParser from "cookie-parser";

const host = "0.0.0.0";
const port = 3000;
var listaTimes = [];
var listaJogadores = [];

const app = express();

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: "C0D1G04C3SS0",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 30,
        httpOnly: true,
        secure: false
    }

}));

app.use(cookieParser())

app.get("/", verificarAutenticacao, (requisicao, resposta) => {
    const ultimoLogin = requisicao.cookies.ultimoacesso

    resposta.send(`
        <!DOCTYPE html>
<html lang="pt-br">

<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Página Inicial</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }

        body {
            min-height: 100vh;
            background-color: #f2f2f2;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            text-align: center;
            padding-top: 100px;
            flex-direction: column;
            padding-left: 15px;
            padding-right: 15px;
        }

        .homepage-container {
            max-width: 700px;
            padding: 60px;
            background: #f9f9f9;
            border-radius: 16px;
            box-shadow: 0 4px 18px rgba(0, 0, 0, 0.1);
            width: 100%;
            box-sizing: border-box;
            margin-top: -200px;
            margin-left: auto;
            margin-right: auto;
        }

        h1 {
            font-size: 36px;
            color: #333;
            margin-bottom: 20px;
        }

        p {
            font-size: 18px;
            color: #555;
            margin-bottom: 30px;
        }

        a.button {
            display: inline-block;
            padding: 18px 28px;
            background-color: #1c54ac;
            color: white;
            font-weight: bold;
            border-radius: 8px;
            text-decoration: none;
            font-size: 16px;
            transition: background-color 0.3s, color 0.3s, transform 0.3s ease;
            width: 250px;
            height: 55px;
            box-shadow: 2px 4px 10px black;
        }

        a.button:hover {
            background-color: #144696;
            color: #FFFBDE;
            transform: scale(1.02);
        }

        /* Responsividade */
        @media (max-width: 768px) {
            .homepage-container {
                padding: 30px 20px;
            }

            h1 {
                font-size: 28px;
            }

            a.button {
                width: 100%;
                height: 50px;
                padding: 14px 0;
            }
        }

        /* Espaçamento entre os links da navbar */
        .navbar-nav {
            gap: 30px;
        }
        .spanstyle{
        
        }
    </style>
</head>

<body>
     <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
        <div class="container-fluid">
            <img src="logo_time.png" width="90" height="80" alt="Logo" class="ms-2 me-4">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="d-flex flex-column flex-lg-row w-100 justify-content-between">
                    <div class="navbar-nav gap-3">
                        <a class="nav-link" href="/">Início</a>
                        <a class="nav-link" href="/cadastrartime">Cadastrar Time</a>
                        <a class="nav-link" href="/cadastrarjogador">Cadastrar Jogadores</a>
                        <a class="nav-link" href="/timescadastrados">Lista de Times</a>
                        <a class="nav-link" href="/jogadorescadastrados">Lista de Jogadores</a>
                        <span class="nav-link">${ultimoLogin?"Ultimo Acesso: " + ultimoLogin:""} </span>
                    </div>
                    <div class="navbar-nav ms-lg-auto">
                        <a class="nav-link" href="/logout">Sair</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <div class="homepage-container">
        <h1>Escolha a opção desejada</h1>
        <br />
        <a class="button" href="/cadastrartime">Cadastrar time</a>
        <br /><br />
        <a class="button" href="/cadastrarjogador">Cadastrar jogadores</a>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>`);

    resposta.end();
})


app.get("/cadastrartime",verificarAutenticacao, (requisicao, resposta)=>{
    const ultimoLogin = requisicao.cookies.ultimoacesso
    resposta.send(`
         <!DOCTYPE html>
<html lang="pt-br">

<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cadastro de Time</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }

        body {
            background-color: #f2f2f2;
        }

       .navbar-nav {
            gap: 30px;
        }
        .main {
            margin-top: 100px;
            display: flex;
            justify-content: center;
            padding: 40px 20px;
        }

        .container {
            background: #f9f9f9;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 800px;
        }

        .container h2 {
            margin-bottom: 30px;
            color: #333;
            text-align: center;
        }

        form {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px 30px;
        }

        form label {
            font-size: 14px;
            color: #5e5d5d;
            margin-bottom: 5px;
            display: block;
        }

        .full-width {
            grid-column: 1 / 3;
        }

        form input,
        form select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 14px;
        }

        button {
            grid-column: 1 / 3;
            margin-top: 10px;
            padding: 12px;
            border: none;
            border-radius: 6px;
            background-color:#0d6efd;
            color: white;
            font-weight: bold;
            font-size: 15px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        button:hover {
            background-color: #054ab3;
            color: #FFFBDE;
        }

        @media (max-width: 700px) {
            form {
                grid-template-columns: 1fr;
            }

            .full-width {
                grid-column: 1 / 2;
            }

            button {
                grid-column: 1 / 2;
            }
        }

        textarea {
            resize: none;
            padding: 10px;
            border: 1px solid #ccc;
        }
             .spanstyle{
            color: white;
            text-decoration: none;
            font-size: 15px;
            line-height: 60px;
        }
    </style>
</head>

<body>
<nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
        <div class="container-fluid">
            <img src="logo_time.png" width="90" height="80" alt="Logo" class="ms-2 me-4">

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="d-flex flex-column flex-lg-row w-100 justify-content-between">
                    <div class="navbar-nav gap-3">
                        <a class="nav-link" href="/">Início</a>
                        <a class="nav-link" href="/cadastrartime">Cadastrar Time</a>
                        <a class="nav-link" href="/cadastrarjogador">Cadastrar Jogadores</a>
                        <a class="nav-link" href="/timescadastrados">Lista de Times</a>
                        <a class="nav-link" href="/jogadorescadastrados">Lista de Jogadores</a>
                        <span class="nav-link">${ultimoLogin?"Ultimo Acesso: " + ultimoLogin:""} </span>
                    </div>
                    <div class="navbar-nav ms-lg-auto">
                        <a class="nav-link" href="/logout">Sair</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
    <div class="main">
        <div class="container">
            <form method="POST" action="/cadastrartime" novalidate>
                <h2 class="full-width">Cadastro de Time</h2>

                <label for="equipe">Nome do time </label>
                <input type="text" id="equipe" name="equipe" required>

                <label for="tecnico">Nome do técnico responsável</label>
                <input type="text" id="tecnico" name="tecnico" required>

                <label for="telefone">Telefone do técnico responsável</label>
                <input type="number" id="telefone" name="telefone" required>
               
               
                <button type="submit">Cadastrar Time</button>
            </form>
        </div>
    </div>
 <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    </body>

    </html>
        `);
    resposta.end();
})

app.post("/cadastrartime", (requisicao, resposta) =>{
    const ultimoLogin = requisicao.cookies.ultimoacesso
    const equipe = requisicao.body.equipe;
    const tecnico = requisicao.body.tecnico;
    const telefone = requisicao.body.telefone;
    

  if (equipe && tecnico && telefone) {
        
        listaTimes.push({
            equipe,
            tecnico,
            telefone
        });

        resposta.redirect("/timescadastrados");
}else{
    let conteudo = `<!DOCTYPE html>
<html lang="pt-br">

<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cadastro de Time</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }

        body {
            background-color: #f2f2f2;
        }

       .navbar-nav {
            gap: 30px;
        }
        .main {
            margin-top: 100px;
            display: flex;
            justify-content: center;
            padding: 40px 20px;
        }

        .container {
            background: #f9f9f9;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 800px;
        }

        .container h2 {
            margin-bottom: 30px;
            color: #333;
            text-align: center;
        }

        form {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px 30px;
        }

        form label {
            font-size: 14px;
            color: #5e5d5d;
            margin-bottom: 5px;
            display: block;
        }

        .full-width {
            grid-column: 1 / 3;
        }

        form input,
        form select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 14px;
        }

        button {
            grid-column: 1 / 3;
            margin-top: 10px;
            padding: 12px;
            border: none;
            border-radius: 6px;
            background-color:#0d6efd;
            color: white;
            font-weight: bold;
            font-size: 15px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        button:hover {
            background-color: #054ab3;
            color: #FFFBDE;
        }

        @media (max-width: 700px) {
            form {
                grid-template-columns: 1fr;
            }

            .full-width {
                grid-column: 1 / 2;
            }

            button {
                grid-column: 1 / 2;
            }
        }

        textarea {
            resize: none;
            padding: 10px;
            border: 1px solid #ccc;
        }
             .spanstyle{
            color: white;
            text-decoration: none;
            font-size: 15px;
            line-height: 60px;
        }
    </style>
</head>

<body>
<nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
        <div class="container-fluid">
            <img src="logo_time.png" width="90" height="80" alt="Logo" class="ms-2 me-4">

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="d-flex flex-column flex-lg-row w-100 justify-content-between">
                    <div class="navbar-nav gap-3">
                        <a class="nav-link" href="/">Início</a>
                        <a class="nav-link" href="/cadastrartime">Cadastrar Time</a>
                        <a class="nav-link" href="/cadastrarjogador">Cadastrar Jogadores</a>
                        <a class="nav-link" href="/timescadastrados">Lista de Times</a>
                        <a class="nav-link" href="/jogadorescadastrados">Lista de Jogadores</a>
                        <span class="nav-link">${ultimoLogin?"Ultimo Acesso: " + ultimoLogin:""} </span>
                    </div>
                    <div class="navbar-nav ms-lg-auto">
                        <a class="nav-link" href="/logout">Sair</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
    <div class="main">
        <div class="container">
            <form method="POST" action="/cadastrartime" novalidate>
                <h2 class="full-width">Cadastro de Time</h2>`;
    if(!equipe){
        conteudo = conteudo + `
                <label for="equipe">Nome do time </label>
                <input type="text" style="border: 1px solid #ff0000;"id="equipe" name="equipe" required  placeholder="Por favor, informe o nome do time">  
        `
    }
    else{
        conteudo = conteudo + `
                       <label for="equipe">Nome do time </label>
                <input type="text" id="equipe" name="equipe" value= ${equipe}required>`;
    }
      if (!tecnico) {
            conteudo += `<label for="tecnico">Nome do técnico responsável</label>
                <input type="text" style="border: 1px solid #ff0000;" id="tecnico" name="tecnico" required placeholder="Por favor, informe o nome do técnico">
`
        } else {
            conteudo += `
                <label for="tecnico">Nome do técnico responsável</label>
                <input type="text" id="tecnico" name="tecnico" value= ${tecnico} required>`;
        }
        if (!telefone) {
            conteudo += `<label for="telefone">Telefone do técnico responsável</label>
                <input type="number" id="telefone" name="telefone" style="border: 1px solid #ff0000;" required>`
        } else {
            conteudo += `<label for="telefone">Telefone do técnico responsável</label>
        <input type="number" id="telefone" name="telefone" value=${telefone}required>`;
        }
        
        
        conteudo +=`
                <button type="submit">Cadastrar Time</button>
            </form>
        </div>
    </div>
 <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    </body>

    </html>`
    resposta.send(conteudo);
    resposta.end();

}
});

app.get("/timescadastrados",verificarAutenticacao, (requisicao, resposta) =>{
        const ultimoLogin = requisicao.cookies.ultimoacesso
    let conteudo = `<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Times Cadastrados</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />

    <style>
        body {
            background-color: #f2f2f2;
            font-family: Arial, sans-serif;
        }

        .container {
            max-width: 90%;
            margin: 0 auto;
            padding-top: 180px;
        }

    
        .table-responsive {
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .navbar-nav {
            gap: 30px;
        }
    </style>
</head>

<body>
    <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
        <div class="container-fluid">
            <img src="logo_time.png" width="90" height="80" alt="Logo" class="ms-2 me-4">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="d-flex flex-column flex-lg-row w-100 justify-content-between">
                    <div class="navbar-nav gap-3">
                        <a class="nav-link" href="/">Início</a>
                        <a class="nav-link" href="/cadastrartime">Cadastrar Time</a>
                        <a class="nav-link" href="/cadastrarjogador">Cadastrar Jogadores</a>
                        <a class="nav-link" href="/timescadastrados">Lista de Times</a>
                        <a class="nav-link" href="/jogadorescadastrados">Lista de Jogadores</a>
                        <span class="nav-link">${ultimoLogin?"Ultimo Acesso: " + ultimoLogin:""} </span>
                    </div>
                    <div class="navbar-nav ms-lg-auto">
                        <a class="nav-link" href="/logout">Sair</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <div class="container">
        <h2 class="text-center mb-4">Lista de times cadastrados</h2>

        <div class="table-responsive shadow-sm">
            <table class="table table-bordered table-striped table-hover align-middle text-center">
                <thead class="table-primary">
                    <tr>
                        <th>Nome da equipe</th>
                        <th>Nome do técnico responsável</th>
                        <th>Telefone do técnico responsável</th>
                    </tr>
                </thead>
                <tbody>
        `;
        if(listaTimes.length === 0){
            conteudo +=`
                <tr>
                    <td colspan="7" class="fst-italic text-secondary">Nenhum time cadastrado no momento.</td>
                </tr>
            `
        }else{
            for(let i=0; i<listaTimes.length;i++){
                conteudo +=`
                <tr>
                     <td>${listaTimes[i].equipe}</td>
                     <td>${listaTimes[i].tecnico}</td>
                     <td>${listaTimes[i].telefone}</td>
                </tr>`
            }}

        conteudo +=`
             </tbody>
            </table>
        </div>

        <div class="text-center mt-4">
            <a href="/cadastrartime" class="btn btn-primary fw-bold">Cadastrar time</a>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>`
    resposta.send(conteudo);
    resposta.end()
})

app.get("/cadastrarjogador", verificarAutenticacao, (req, resposta) => {
    const ultimoLogin = requisicao.cookies.ultimoacesso

    let conteudo = `
    <!DOCTYPE html>
    <html lang="pt-br">

    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Cadastro de Jogadores</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
            }
            body {
                background-color: #f2f2f2;
            }
            .navbar-nav {
                gap: 30px;
            }
            .main {
                margin-top: 100px;
                display: flex;
                justify-content: center;
                padding: 40px 20px;
            }
            .container {
                background: #f9f9f9;
                padding: 40px;
                border-radius: 12px;
                box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
                width: 100%;
                max-width: 800px;
            }
            .container h2 {
                margin-bottom: 30px;
                color: #333;
                text-align: center;
            }
            form {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px 30px;
            }
            form label {
                font-size: 14px;
                color: #5e5d5d;
                margin-bottom: 5px;
                display: block;
            }
            .full-width {
                grid-column: 1 / 3;
            }
            form input,
            form select {
                width: 100%;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 6px;
                font-size: 14px;
            }
            button {
                grid-column: 1 / 3;
                margin-top: 10px;
                padding: 12px;
                border: none;
                border-radius: 6px;
                background-color: #0d6efd;
                color: white;
                font-weight: bold;
                font-size: 15px;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            button:hover {
                background-color: #054ab3;
                color: #FFFBDE;
            }
            @media (max-width: 700px) {
                form {
                    grid-template-columns: 1fr;
                }
                .full-width {
                    grid-column: 1 / 2;
                }
                button {
                    grid-column: 1 / 2;
                }
            }
        </style>
    </head>

    <body>
        <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
            <div class="container-fluid">
                <img src="logo_time.png" width="90" height="80" alt="Logo" class="ms-2 me-4">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                    aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div class="d-flex flex-column flex-lg-row w-100 justify-content-between">
                        <div class="navbar-nav gap-3">
                            <a class="nav-link" href="/">Início</a>
                            <a class="nav-link" href="/cadastrartime">Cadastrar Time</a>
                            <a class="nav-link" href="/cadastrarjogador">Cadastrar Jogadores</a>
                            <a class="nav-link" href="/timescadastrados">Lista de Times</a>
                            <a class="nav-link" href="/jogadorescadastrados">Lista de Jogadores</a>
                            <span class="nav-link">${ultimoLogin?"Ultimo Acesso: " + ultimoLogin:""} </span>
                        </div>
                        <div class="navbar-nav ms-lg-auto">
                            <a class="nav-link" href="/logout">Sair</a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <div class="main">
            <div class="container">
                <form method="POST" action="/cadastrarjogador" novalidate>
                    <h2 class="full-width">Cadastro de Jogador</h2>

                    <label for="jogador">Nome do jogador</label>
                    <input type="text" id="jogador" name="jogador" required>

                    <label for="numero">Número da camisa</label>
                    <input type="text" id="numero" name="numero" inputmode="numeric" pattern="[0-9]{1,2}" maxlength="2" required>

                    <label for="data">Data de nascimento</label>
                    <input type="date" id="data" name="data" required max="2025-12-31">


                    <label for="altura">Altura em CM</label>
                    <input type="text" id="altura" name="altura" inputmode="numeric" pattern="[0-9]{2,3}" maxlength="3" required>

                    <label for="genero">Gênero</label>
                    <select name="genero" id="genero" required>
                        <option value="" disabled selected>Escolha seu gênero</option>
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                        <option value="outro">Outro</option>
                    </select>

                    <label for="posicao">Posição</label>
                    <select name="posicao" id="posicao" required>
                        <option value="" disabled selected>Escolha sua posição</option>
                        <option value="goleiro">Goleiro</option>
                        <option value="atacante">Atacante</option>
                        <option value="zagueiro">Zagueiro</option>
                        <option value="lateral">Lateral</option>
                        <option value="volante">Volante</option>
                        <option value="meiodecampo">Meio de campo</option>
                        <option value="ponta">Ponta</option>
                        <option value="centroavante">Centroavante</option>
                    </select>

                    <label for="equipe">Equipe</label>
                    <select name="equipe" id="equipe" required>
                        <option value="" disabled selected>Escolha seu time</option>
    `;

    if (listaTimes.length === 0) {
        conteudo += `<option disabled>Nenhum time cadastrado</option>`;
    } else {
        for (let i = 0; i < listaTimes.length; i++) {
            conteudo += `<option value="${listaTimes[i].equipe}">${listaTimes[i].equipe}</option>`;
        }
    }

    conteudo += `
                    </select>
                    <button type="submit">Cadastrar Jogador</button>
                </form>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>`;

    resposta.send(conteudo);
    resposta.end()
});

app.post("/cadastrarjogador", (requisicao, resposta) =>{
    const ultimoLogin = requisicao.cookies.ultimoacesso
    const jogador = requisicao.body.jogador;
    const numero = requisicao.body.numero;
    const data = requisicao.body.data;
    const altura = requisicao.body.altura;
    const genero = requisicao.body.genero;
    const equipe = requisicao.body.equipe;
    const posicao = requisicao.body.posicao;
    

  if (jogador && numero && data && altura&& genero && equipe && posicao) {
        
        listaJogadores.push({
        jogador,
        numero,
        data,
        altura,
        genero,
        equipe,
        posicao
        });

        resposta.redirect("/jogadorescadastrados");
}else{
    let conteudo = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cadastro de Jogadores</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }

        body {
            background-color: #f2f2f2;
        }

        .navbar-nav {
            gap: 30px;
        }

        .main {
            margin-top: 100px;
            display: flex;
            justify-content: center;
            padding: 40px 20px;
        }

        .container {
            background: #f9f9f9;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 800px;
        }

        .container h2 {
            margin-bottom: 30px;
            color: #333;
            text-align: center;
        }

        form {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px 30px;
        }

        form label {
            font-size: 14px;
            color: #5e5d5d;
            margin-bottom: 5px;
            display: block;
        }

        .full-width {
            grid-column: 1 / 3;
        }

        form input,
        form select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 14px;
        }

        button {
            grid-column: 1 / 3;
            margin-top: 10px;
            padding: 12px;
            border: none;
            border-radius: 6px;
            background-color: #0d6efd;
            color: white;
            font-weight: bold;
            font-size: 15px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        button:hover {
            background-color: #054ab3;
            color: #FFFBDE;
        }

        @media (max-width: 700px) {
            form {
                grid-template-columns: 1fr;
            }

            .full-width {
                grid-column: 1 / 2;
            }

            button {
                grid-column: 1 / 2;
            }
        }

        textarea {
            resize: none;
            padding: 10px;
            border: 1px solid #ccc;
        }

        .spanstyle {
            color: white;
            text-decoration: none;
            font-size: 15px;
            line-height: 60px;
        }
    </style>
</head>

<body>
    <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
        <div class="container-fluid">
            <img src="logo_time.png" width="90" height="80" alt="Logo" class="ms-2 me-4">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="d-flex flex-column flex-lg-row w-100 justify-content-between">
                    <div class="navbar-nav gap-3">
                        <a class="nav-link" href="/">Início</a>
                        <a class="nav-link" href="/cadastrartime">Cadastrar Time</a>
                        <a class="nav-link" href="/cadastrarjogador">Cadastrar Jogadores</a>
                        <a class="nav-link" href="/timescadastrados">Lista de Times</a>
                        <a class="nav-link" href="/jogadorescadastrados">Lista de Jogadores</a>
                        <span class="nav-link">${ultimoLogin?"Ultimo Acesso: " + ultimoLogin:""} </span>
                    </div>
                    <div class="navbar-nav ms-lg-auto">
                        <a class="nav-link" href="/logout">Sair</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
    <div class="main">
        <div class="container">
            <form method="POST" action="/cadastrarjogador" novalidate>
                <h2 class="full-width">Cadastro de Jogador</h2>`;

    if(!jogador){
        conteudo = conteudo + `
                <label for="jogador">Nome do jogador </label>
                <input type="text" id="jogador"  style="border: 1px solid #ff0000;"name="jogador" required placeholder="Por favor, informe o nome do jogador">
        `
    }
    else{
        conteudo = conteudo + `
                       <label for="jogador">Nome do jogador </label>
                <input type="text" id="jogador" name="jogador" value="${jogador}" required>`;
    }
        if (!numero) {
            conteudo += `<label for="numero">Número da camisa</label>
            <input type="number" id="numero" name="numero" style="border: 1px solid #ff0000;" min="0" max="99" required placeholder="Por favor, informe o número da camisa">`;
        } else {
            conteudo += `<label for="numero">Número da camisa</label>
            <input type="number" id="numero" name="numero" value="${numero}" min="0" max="99" required>`;
        }
        if (!data) {
            conteudo += `<label for="data">Data de nascimento</label>
            <input type="date" id="data"  style="border: 1px solid #ff0000;"name="data" required max="2025-12-31">`
        } else {
            conteudo += `<label for="data">Data de nascimento</label>
            <input type="date" id="data" name="data"  value="${data}" required max="2025-12-31">
            `;

        }

         if (!altura) {
        conteudo += `<label for="altura">Altura em CM</label>
        <input type="number" id="altura" name="altura" style="border: 1px solid #ff0000;" min="10" max="999" required placeholder="Por favor, informe a altura do jogador">`;
    } else {
        conteudo += `<label for="altura">Altura em CM</label>
        <input type="number" id="altura" name="altura" value="${altura}" min="10" max="999" required>`;
    }


      if (!genero) {
    conteudo += `<label for="genero">Gênero</label>
    <select name="genero" id="genero" style="border: 1px solid #ff0000;" required>
        <option selected disabled value="">Escolha seu gênero</option>
        <option value="masculino">Masculino</option>
        <option value="feminino">Feminino</option>
        <option value="outro">Outro</option>
    </select>`;
} else {
    conteudo += `<label for="genero">Gênero</label>
    <select name="genero" id="genero" style="border: 1px solid #ccc;" required>
        <option disabled value="">Escolha seu gênero</option>
        <option ${genero === "masculino" ? "selected" : ""} value="masculino">Masculino</option>
        <option ${genero === "feminino" ? "selected" : ""} value="feminino">Feminino</option>
        <option ${genero === "outro" ? "selected" : ""} value="outro">Outro</option>
    </select>`;
}

if (!posicao) {
    conteudo += `<label for="posicao">Posição</label>
    <select name="posicao" id="posicao" style="border: 1px solid #ff0000;" required>
        <option selected disabled value="">Escolha sua posição</option>
        <option value="goleiro">Goleiro</option>
        <option value="atacante">Atacante</option>
        <option value="zagueiro">Zagueiro</option>
        <option value="lateral">Lateral</option>
        <option value="volante">Volante</option>
        <option value="meiodecampo">Meio de campo</option>
        <option value="ponta">Ponta</option>
        <option value="centroavante">Centroavante</option>
    </select>`;
} else {
    conteudo += `<label for="posicao">Posição</label>
    <select name="posicao" id="posicao" style="border: 1px solid #ccc;" required>
        <option disabled value="">Escolha sua posição</option>
        <option ${posicao === "goleiro" ? "selected" : ""} value="goleiro">Goleiro</option>
        <option ${posicao === "atacante" ? "selected" : ""} value="atacante">Atacante</option>
        <option ${posicao === "zagueiro" ? "selected" : ""} value="zagueiro">Zagueiro</option>
        <option ${posicao === "lateral" ? "selected" : ""} value="lateral">Lateral</option>
        <option ${posicao === "volante" ? "selected" : ""} value="volante">Volante</option>
        <option ${posicao === "meiodecampo" ? "selected" : ""} value="meiodecampo">Meio de campo</option>
        <option ${posicao === "ponta" ? "selected" : ""} value="ponta">Ponta</option>
        <option ${posicao === "centroavante" ? "selected" : ""} value="centroavante">Centroavante</option>
    </select>`;
}

if (!equipe) {
    conteudo += `<label for="equipe">Equipe</label>
    <select name="equipe" id="equipe" style="border: 1px solid #ff0000;" required>
        <option selected disabled value="">Escolha seu time</option>`;

    for (let i = 0; i < listaTimes.length; i++) {
        conteudo += `<option value="${listaTimes[i].equipe}">${listaTimes[i].equipe}</option>`;
    }

    conteudo += `</select>`;
} else {
    conteudo += `<label for="equipe">Equipe</label>
    <select name="equipe" id="equipe" required>
        <option disabled value="">Escolha seu time</option>`;

    for (let i = 0; i < listaTimes.length; i++) {
        conteudo += `<option value="${listaTimes[i].equipe}" ${equipe === listaTimes[i].equipe ? "selected" : ""}>${listaTimes[i].equipe}</option>`;
    }

    conteudo += `</select>`;
}
        conteudo += `
                <button type="submit">Cadastrar Jogador</button>
            </form>
        </div>
        </body>
        </html>`
    resposta.send(conteudo);
    resposta.end()
}
});

app.get("/jogadorescadastrados", verificarAutenticacao, (requisicao, resposta) =>{
    const ultimoLogin = requisicao.cookies.ultimoacesso
    let conteudo = `
    
    <!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Jogadores Cadastrados</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />

    <style>
        .navbar-nav {
            gap: 30px;
        }
        body {
            background-color: #f2f2f2;
            font-family: Arial, sans-serif;
        }

        .container {
            max-width: 90%;
            margin: 0 auto;
            padding-top: 180px;
        }

    
        .table-responsive {
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>

<body>
    <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
        <div class="container-fluid">
            <img src="logo_time.png" width="90" height="80" alt="Logo" class="ms-2 me-4">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="d-flex flex-column flex-lg-row w-100 justify-content-between">
                    <div class="navbar-nav gap-3">
                        <a class="nav-link" href="/">Início</a>
                        <a class="nav-link" href="/cadastrartime">Cadastrar Time</a>
                        <a class="nav-link" href="/cadastrarjogador">Cadastrar Jogadores</a>
                        <a class="nav-link" href="/timescadastrados">Lista de Times</a>
                        <a class="nav-link" href="/jogadorescadastrados">Lista de Jogadores</a>
                        <span class="nav-link">${ultimoLogin?"Ultimo Acesso: " + ultimoLogin:""} </span>
                    </div>
                    <div class="navbar-nav ms-lg-auto">
                        <a class="nav-link" href="/logout">Sair</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <div class="container">
        <h2 class="text-center mb-4">Lista de jogadores cadastrados</h2>

        <div class="table-responsive shadow-sm">
            <table class="table table-bordered table-striped table-hover align-middle text-center">
                <thead class="table-primary">
                    <tr>
                        <th>Nome do jogador</th>
                        <th>Número da camisa</th>
                        <th>Data de nascimento</th>
                        <th>Altura em CM</th>
                        <th>Gênero</th>
                        <th>Posição</th>
                        <th>Equipe</th>
                    </tr>
                    </thead>
                    <tbody>`;
                if(listaJogadores.length === 0 ){
                    conteudo += `
                    <tr>
                        <td colspan="7" class="fst-italic text-secondary">Nenhum jogador cadastrado no momento.</td>
                    </tr>`
                }
                else {
    // 1. Agrupar jogadores por equipe
    const jogadoresPorEquipe = {};
    for (let jogador of listaJogadores) {
        if (!jogadoresPorEquipe[jogador.equipe]) {
            jogadoresPorEquipe[jogador.equipe] = [];
        }
        jogadoresPorEquipe[jogador.equipe].push(jogador);
    }

                    for (let equipe in jogadoresPorEquipe) {
                        conteudo += `
                        <tr>
                           <td colspan="7" class="table-secondary fw-bold text-center">Time: ${equipe}</td>
                        </tr>`;
                    
                        for (let jogador of jogadoresPorEquipe[equipe]) {
                            const partes = jogador.data.split("-");
                            const dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
                        
                            conteudo += `
                            <tr>
                                <td>${jogador.jogador}</td>
                                <td>${jogador.numero}</td>
                                <td>${dataFormatada}</td>
                                <td>${jogador.altura}</td>
                                <td>${jogador.genero}</td>
                                <td>${jogador.posicao}</td>
                                <td>${jogador.equipe}</td>
                            </tr>`;
                        }
                    }
                }

                    conteudo += `
                </tbody>
            </table>
        </div>
        <div class="text-center mt-4">
            <a href="/cadastrarjogador" class="btn btn-primary fw-bold">Cadastrar jogador</a>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`
resposta.send(conteudo);
resposta.end()
})

app.get("/login", (requisicao, resposta) => {
    resposta.send(`
        <!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet">
</head>

<body>

    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }

        body {
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f2f2f2;
        }

        .container {
            background: #f9f9f9;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            width: 450px;
            text-align: center;
        }

        .container h2 {
            margin-bottom: 20px;
            color: #333;
        }

        form {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        form label {
            text-align: left;
            font-size: 14px;
            color: #5e5d5d;
             margin-bottom: -5px;
        }

        form input,
        form select {
            padding: 12px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 14px;

        }

        button {
            margin-top: 10px;
            padding: 10px;
            border: none;
            border-radius: 6px;
           background-color:#0d6efd;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        button:hover {
            background-color:#114eaa;
        }

        .container a {
            display: block;
            margin-top: 15px;
            font-size: 14px;
            color: #0d6efd;;
            text-decoration: none;
        }

        .container a:hover {
            text-decoration: underline;
        }
    </style>
    <div class="container">
        <h2>LOGIN</h2>
        <form id="login-form" acton="/login" method="post" novalidate>
            <label for="nome">Login</label>
            <input type="text" id="nome" name="nome"  required>

            <label for="senha">Senha</label>
            <input type="password" id="senha" name="senha" required>

            <button type="submit" name="submit">Login</button>
        </form>
        <a href="#">Contate o suporte caso seu login não esteja autorizado!</a>
    </div>
</body>

</html>   
          
        `)
      resposta.end()
})

app.post("/login", (requisicao,resposta) =>{
    const usuario = requisicao.body.nome
    const senha = requisicao.body.senha

    if(usuario == "admin" && senha == "123"){
        requisicao.session.logado = true;
        const datahr = new Date()
         resposta.cookie('ultimoacesso',datahr.toLocaleString(), { maxAge: 1000 * 60 * 60 * 24 * 30});
        resposta.redirect("/")
    }
    else{
        let conteudo = `
     <!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet">
</head>

<body>

    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }

        body {
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f2f2f2;
        }

        .container {
            background: #f9f9f9;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            width: 450px;
            text-align: center;
        }

        .container h2 {
            margin-bottom: 20px;
            color: #333;
        }

        form {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        form label {
            text-align: left;
            font-size: 14px;
            color: #5e5d5d;
             margin-bottom: -5px;
        }

        form input,
        form select {
            padding: 12px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 14px;

        }

        button {
            margin-top: 10px;
            padding: 10px;
            border: none;
            border-radius: 6px;
           background-color:#0d6efd;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        button:hover {
            background-color:#114eaa;
        }

        .container a {
            display: block;
            margin-top: 15px;
            font-size: 14px;
            color: #0d6efd;;
            text-decoration: none;
        }

        .container a:hover {
            text-decoration: underline;
        }
    </style>
    <div class="container">
        <h2>LOGIN</h2>
        <form id="login-form" acton="/login" method="post" novalidate>
        `;
    if(!usuario){
        conteudo +=`
            <label for="nome">Login</label>
            <input type="text" id="nome" name="nome" value= "${usuario}"  placeholder="Campo não pode ser vazio" required>

        `;
    }
    else{
        conteudo += `
        <label for="nome">Login</label>
        <input type="text" id="nome" name="nome" value="${usuario}" required>
        `;
    }
    if (!senha) {
      conteudo += `
        <label for="senha">Senha</label>
        <input type="password" id="senha" name="senha" value="${senha}" placeholder="Campo não pode ser vazio" required>
        
      `;
    } else {
      conteudo += `
        <label for="senha">Senha</label>
        <input type="password" id="senha" name="senha" value="${senha}" required>
      `;
    }

     conteudo += `
        <span class="erro">Login ou senha inválidos</span>
        <button type="submit" name="submit">Login</button>
        </form>
        <a href="#">Entre em contato com o responsável caso seu login não esteja autorizado!</a>
        </div>
        </body>

        </html>   
     `   
     resposta.send (conteudo)
    }
   resposta.end(); 
})

function verificarAutenticacao (requisicao, resposta, next){
    if(requisicao.session.logado){
        next();
    }
    else{
        resposta.redirect("/login")
    }
}

app.get("/logout", (requisicao,resposta) =>{
  requisicao.session.destroy();
  resposta.redirect("/login");
})

app.listen(port, host, ()=>{
    console.log(`Servidor rodando em http://${host}:${port}/`)  
})