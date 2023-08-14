const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const companyAuth = require('../companyAuth');

router.use((req, res, next) => {
    console.log('Middleware for company');
    next();
});

router.post('/registerCompany', async (req, res) => {
    const saltRounds = 10;
    let sinCifrar = req.body.Password;
    const salt = bcrypt.genSaltSync(saltRounds);
    const cifrado = bcrypt.hashSync(sinCifrar, salt);

    try {
        const query = 'INSERT INTO public."Companies"("Name", "PhoneNumber", "Email", "Password") VALUES ($1, $2, $3, $4);';
        await pool.query(query, [
            req.body.Name, 
            req.body.PhoneNumber, 
            req.body.Email, 
            cifrado
        ]);

        res.status(201).send('Datos insertados correctamente');
    } catch (error) {
        console.error('Error al insertar datos:', error);
        res.status(500).send('Error al insertar datos en la base de datos');
    }
});

router.post('/publishProject', companyAuth, async (req, res) => {
    let companyId = -1;
    const authHeader = req.headers.authorization;

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    
    console.log(companyId);
    console.log(username);
    try {
        const companyQuery = 'SELECT "Id" FROM public."Companies" WHERE "Email" = $1;';
        const companyResult = await pool.query(companyQuery, [
            username
        ]);
        companyId = companyResult.rows[0].Id;
        console.log(companyId);
    } catch (error) {
        console.error('Error al consultar Company:', error);
        res.status(500).send('Error al consultar datos en la base de datos');
    }

    try {
        const query = 'INSERT INTO public."Projects"("Title", "Description", "TimeBudget", "CostBudget", "Company") VALUES ($1, $2, $3, $4, $5);';
        console.log(companyId);
        await pool.query(query, [
            req.body.Title, 
            req.body.Description, 
            req.body.TimeBudget,
            req.body.CostBudget, 
            companyId
        ]);

        res.status(201).send('Datos insertados correctamente');
    } catch (error) {
        console.error('Error al insertar datos:', error);
        res.status(500).send('Error al insertar datos en la base de datos');
    }
});

router.post('/addProjectSkill', companyAuth, async (req, res) => {
    //Buscar Projects por Title y obtener projectId
    let title = req.body.Title;
    let projectId = -1;
    try {
        const projectsQuery = 'SELECT "Id"	FROM public."Projects" WHERE "Title" = $1;';
        const projectsResult = await pool.query(projectsQuery, [title]);
        projectId = projectsResult.rows[0].Id;
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).send('Error en la consulta a la base de datos');
    }

    //Para cada Skill en Skills:
    let skills = req.body.Skills;
    for (const skill of skills) {
        //  Buscar Skill por Description y obtener skillId
        try {
            const skillsQuery = 'SELECT "Id" FROM public."Skills" WHERE "Description" = $1;';
            const skillsResult = await pool.query(skillsQuery, [skill]);
            skillId = skillsResult.rows[0].Id;
        } catch (error) {
            console.error('Error en la consulta:', error);
            res.status(500).send('Error en la consulta a la base de datos');
        }
        //  Insertar en ProjectSkill el projectId y el SkillId
        try {
            const query = 'INSERT INTO public."ProjectSkill"("Project", "Skill") VALUES ($1, $2);';
            await pool.query(query, [
                projectId,
                skillId
            ]);
    
            res.status(201).send('Datos insertados correctamente');
        } catch (error) {
            console.error('Error al insertar datos:', error);
            res.status(500).send('Error al insertar datos en la base de datos');
        }
    }
});

router.get('/consultProfessionals', companyAuth, async (req, res) => {
    try {
        const query = 'SELECT * FROM public."ProfessionalProfiles";';
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).send('Error en la consulta a la base de datos');
    }
});

router.get('/consultProfessionals/identification/:identification', companyAuth, async (req, res) => {
    try {
        const identification = req.params.identification;
        const query = 'SELECT * FROM public."ProfessionalProfiles" WHERE "Identification" = $1;';
        const result = await pool.query(query, [identification]);
        
        if (result.rows.length === 0) {
            res.status(404).send('Profesional no encontrado');
        } else {
            console.log(result.rows[0].Identification);
            const professional = {
                Identification: result.rows[0].Identification,
                FirstNames: result.rows[0].FirstNames,
                SurNames: result.rows[0].SurNames,
                Profession: result.rows[0].Profession,
                PhoneNumber: result.rows[0].PhoneNumber,
                Email: result.rows[0].Email,
                Rate: result.rows[0].Rate,
                Skills: [result.rows[0].Skill]
            };
            for (let index = 1; index < result.rows.length; index++){
                professional.Skills.push(result.rows[index].Skill);
            }
            
            res.json(professional);
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).send('Error en la consulta a la base de datos');
    }
});

router.get('/consultProfessionals/skill/:skill', companyAuth, async (req, res) => {
    try {
        const skill = req.params.skill;
        const query = 'SELECT "Identification", "FirstNames", "SurNames" FROM public."ProfessionalProfiles" WHERE "Skill" = $1;';
        const result = await pool.query(query, [skill]);
        
        if (result.rows.length === 0) {
            res.status(404).send('Profesional no encontrado');
        } else {
            res.json(result.rows);
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).send('Error en la consulta a la base de datos');
    }
});

router.get('/consultCompanyNegotiations', companyAuth, async (req, res) => {
    let companyName = "";
    const authHeader = req.headers.authorization;

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    
    console.log(companyName);
    console.log(username);
    try {
        const companyQuery = 'SELECT "Name" FROM public."Companies" WHERE "Email" = $1;';
        const companyResult = await pool.query(companyQuery, [
            username
        ]);
        companyName = companyResult.rows[0].Name;
        console.log(companyName);
    } catch (error) {
        console.error('Error al consultar Company:', error);
        res.status(500).send('Error al consultar datos en la base de datos');
    }

    try {
        const query = 'SELECT * FROM public."NegotiationsView" WHERE "Company" = $1;';
        const result = await pool.query(query, [companyName]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).send('Error en la consulta a la base de datos');
    }
});

router.get('/consultCompanyNegotiations/identification/:identification', companyAuth, async (req, res) => {
    let companyName = "";
    const authHeader = req.headers.authorization;

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    
    console.log(companyName);
    console.log(username);
    try {
        const companyQuery = 'SELECT "Name" FROM public."Companies" WHERE "Email" = $1;';
        const companyResult = await pool.query(companyQuery, [
            username
        ]);
        companyName = companyResult.rows[0].Name;
        console.log(companyName);
    } catch (error) {
        console.error('Error al consultar Company:', error);
        res.status(500).send('Error al consultar datos en la base de datos');
    }

    try {
        const query = 'SELECT * FROM public."NegotiationsView" WHERE "Professional" = $1;';
        const result = await pool.query(query, [req.params.identification]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).send('Error en la consulta a la base de datos');
    }
});

router.get('/consultCompanyNegotiations/project/:project', companyAuth, async (req, res) => {
    let companyName = "";
    const authHeader = req.headers.authorization;

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    
    console.log(companyName);
    console.log(username);
    try {
        const companyQuery = 'SELECT "Name" FROM public."Companies" WHERE "Email" = $1;';
        const companyResult = await pool.query(companyQuery, [
            username
        ]);
        companyName = companyResult.rows[0].Name;
        console.log(companyName);
    } catch (error) {
        console.error('Error al consultar Company:', error);
        res.status(500).send('Error al consultar datos en la base de datos');
    }

    try {
        const query = 'SELECT * FROM public."NegotiationsView" WHERE "Project" = $1;';
        const result = await pool.query(query, [req.params.project]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).send('Error en la consulta a la base de datos');
    }
});

router.post('/contactProfessional', companyAuth, async (req, res) => {
    let companyId = -1;
    const authHeader = req.headers.authorization;

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    
    console.log(companyId);
    console.log(username);
    try {
        const companyQuery = 'SELECT "Id" FROM public."Companies" WHERE "Email" = $1;';
        const companyResult = await pool.query(companyQuery, [
            username
        ]);
        companyId = companyResult.rows[0].Id;
        console.log(companyId);
    } catch (error) {
        console.error('Error al consultar Company:', error);
        res.status(500).send('Error al consultar datos en la base de datos');
    }

    let professionalId = -1;
    try {
        const professionalQuery = 'SELECT "Id" FROM public."Professionals" WHERE "Identification" = $1;';
        const professionalResult = await pool.query(professionalQuery, [
            req.body.Identification
        ]);
        professionalId = professionalResult.rows[0].Id;
        console.log(professionalId);
    } catch (error) {
        console.error('Error al consultar Professional:', error);
        res.status(500).send('Error al consultar datos en la base de datos');
    }

    let projectId = -1;
    try {
        const projectQuery = 'SELECT "Id" FROM public."Projects" WHERE "Title" = $1;';
        const projectResult = await pool.query(projectQuery, [
            req.body.Title
        ]);
        projectId = projectResult.rows[0].Id;
        console.log(projectId);
    } catch (error) {
        console.error('Error al consultar Project:', error);
        res.status(500).send('Error al consultar datos en la base de datos');
    }

    try {
        const query = 'INSERT INTO public."Negotiations"("Professional", "Company", "Project", "Date", "Status") VALUES ($1, $2, $3, $4, $5);';
        console.log(companyId);
        await pool.query(query, [
            professionalId, 
            companyId, 
            projectId,
            new Date(),
            'In Progress'
        ]);

        res.status(201).send('Datos insertados correctamente');
    } catch (error) {
        console.error('Error al insertar datos:', error);
        res.status(500).send('Error al insertar datos en la base de datos');
    }
});

router.get('/acceptProposals', (req, res) => {
    res.send('Accepting Proposals');
    //Solo cambiar estado
});

router.get('/Deposit Payments', (req, res) => {
    res.send('Depositing Payments');
});

module.exports = router;
