const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const professionalAuth = require('../professionalAuth');

router.use((req, res, next) => {
    console.log('Middleware for professional');
    next();
});

router.post('/registerProfessional', async (req, res) => {
    const saltRounds = 10; // Número de rondas de hash (mayor es más seguro pero más lento)
    let sinCifrar = req.body.Password;
    const salt = bcrypt.genSaltSync(saltRounds);
    const cifrado = bcrypt.hashSync(sinCifrar, salt);

    try {
        const query = 'INSERT INTO public."Professionals" ("Identification", "FirstNames", "SurNames", "Profession", "PhoneNumber", "Email", "Rate", "Password") VALUES ($1, $2, $3, $4, $5, $6, $7, $8);';
        await pool.query(query, [
            req.body.Identification, 
            req.body.FirstNames, 
            req.body.SurNames, 
            req.body.Profession, 
            req.body.PhoneNumber, 
            req.body.Email, 
            req.body.Rate,
            cifrado
        ]);

        res.status(201).send('Datos insertados correctamente');
    } catch (error) {
        console.error('Error al insertar datos:', error);
        res.status(500).send('Error al insertar datos en la base de datos');
    }
});

router.get('/consultProfessionalNegotiations', professionalAuth, async (req, res) => {
    let identification = "";
    const authHeader = req.headers.authorization;

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    
    console.log(identification);
    console.log(username);
    try {
        const companyQuery = 'SELECT "Identification" FROM public."Professionals" WHERE "Email" = $1;';
        const companyResult = await pool.query(companyQuery, [
            username
        ]);
        identification = companyResult.rows[0].Identification;
        console.log(identification);
    } catch (error) {
        console.error('Error al consultar Professional:', error);
        res.status(500).send('Error al consultar datos en la base de datos');
    }

    try {
        const query = 'SELECT * FROM public."NegotiationsView" WHERE "Identification" = $1;';
        const result = await pool.query(query, [identification]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).send('Error en la consulta a la base de datos');
    }
});

router.get('/consultProfessionalNegotiations/company/:company', professionalAuth, async (req, res) => {
    let identification = "";
    const authHeader = req.headers.authorization;

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    
    console.log(identification);
    console.log(username);
    try {
        const companyQuery = 'SELECT "Identification" FROM public."Professionals" WHERE "Email" = $1;';
        const companyResult = await pool.query(companyQuery, [
            username
        ]);
        identification = companyResult.rows[0].Identification;
        console.log(identification);
    } catch (error) {
        console.error('Error al consultar Professional:', error);
        res.status(500).send('Error al consultar datos en la base de datos');
    }

    try {
        const query = 'SELECT * FROM public."NegotiationsView" WHERE "Company" = $1;';
        const result = await pool.query(query, [req.params.company]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).send('Error en la consulta a la base de datos');
    }
});

router.get('/consultProfessionalNegotiations/project/:project', professionalAuth, async (req, res) => {
    let identification = "";
    const authHeader = req.headers.authorization;

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    
    console.log(identification);
    console.log(username);
    try {
        const companyQuery = 'SELECT "Identification" FROM public."Professionals" WHERE "Email" = $1;';
        const companyResult = await pool.query(companyQuery, [
            username
        ]);
        identification = companyResult.rows[0].Identification;
        console.log(identification);
    } catch (error) {
        console.error('Error al consultar Professional:', error);
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

router.post('/sendProposals', professionalAuth, async (req, res) => {
    let professionalId = -1;
    const authHeader = req.headers.authorization;

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    
    console.log(professionalId);
    console.log(username);
    try {
        const professionalQuery = 'SELECT "Id" FROM public."Professionals" WHERE "Email" = $1;';
        const professionalResult = await pool.query(professionalQuery, [
            username
        ]);
        professionalId = professionalResult.rows[0].Id;
        console.log(professionalId);
    } catch (error) {
        console.error('Error al consultar Professional:', error);
        res.status(500).send('Error al consultar datos en la base de datos');
    }

    let companyId = -1;
    try {
        const companyQuery = 'SELECT "Id" FROM public."Companies" WHERE "Name" = $1;';
        const companyResult = await pool.query(companyQuery, [
            req.body.Name
        ]);
        companyId = companyResult.rows[0].Id;
        console.log(companyId);
    } catch (error) {
        console.error('Error al consultar Company:', error);
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
        const query = 'UPDATE public."Negotiations" SET "Duration"=$4, "Cost"=$5, "Status"=$6 WHERE "Professional"=$1 AND "Company"=$2 AND "Project"=$3';
        console.log(professionalId);
        await pool.query(query, [
            professionalId, 
            companyId, 
            projectId,
            req.body.Duration,
            req.body.Cost,
            'In Proposal'
        ]);

        res.status(201).send('Datos actualizados correctamente');
    } catch (error) {
        console.error('Error al insertar datos:', error);
        res.status(500).send('Error al actualizar datos en la base de datos');
    }
});

router.get('/consultProjects', professionalAuth, async (req, res) => {
    try {
        const query = 'SELECT * FROM public."ProjectRequirements";';
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).send('Error en la consulta a la base de datos');
    }
});

router.get('/consultProjects/title/:title', professionalAuth, async (req, res) => {
    try {
        const title = req.params.title;
        const query = 'SELECT * FROM public."ProjectRequirements" WHERE "Title" = $1;';
        const result = await pool.query(query, [title]);
        
        if (result.rows.length === 0) {
            res.status(404).send('Project no encontrado');
        } else {
            console.log(result.rows[0].Title);
            const project = {
                Title: result.rows[0].Title,
                Description: result.rows[0].Description,
                TimeBudget: result.rows[0].TimeBudget,
                CostBudget: result.rows[0].CostBudget,
                Company: result.rows[0].Company,
                Skills: [result.rows[0].Skill]
            };
            for (let index = 1; index < result.rows.length; index++){
                project.Skills.push(result.rows[index].Skill);
            }
            
            res.json(project);
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).send('Error en la consulta a la base de datos');
    }
});

router.get('/consultProjects/skill/:skill', professionalAuth, async (req, res) => {
    try {
        const skill = req.params.skill;
        const query = 'SELECT "Title", "Description", "TimeBudget", "CostBudget", "Company", "Skill" FROM public."ProjectRequirements" WHERE "Skill" = $1;';
        const result = await pool.query(query, [skill]);
        
        if (result.rows.length === 0) {
            res.status(404).send('Project no encontrado');
        } else {
            res.json(result.rows);
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).send('Error en la consulta a la base de datos');
    }
});

router.post('/contactCompany', professionalAuth, async (req, res) => {
    let professionalId = -1;
    const authHeader = req.headers.authorization;

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    
    console.log(professionalId);
    console.log(username);
    try {
        const professionalQuery = 'SELECT "Id" FROM public."Professionals" WHERE "Email" = $1;';
        const professionalResult = await pool.query(professionalQuery, [
            username
        ]);
        professionalId = professionalResult.rows[0].Id;
        console.log(professionalId);
    } catch (error) {
        console.error('Error al consultar Professional:', error);
        res.status(500).send('Error al consultar datos en la base de datos');
    }

    let companyId = -1;
    try {
        const companyQuery = 'SELECT "Id" FROM public."Companies" WHERE "Name" = $1;';
        const companyResult = await pool.query(companyQuery, [
            req.body.Name
        ]);
        companyId = companyResult.rows[0].Id;
        console.log(companyId);
    } catch (error) {
        console.error('Error al consultar Company:', error);
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
        console.log(professionalId);
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

router.get('/Consult Payments', (req, res) => {
    res.send('Consulting Payments');
  });

module.exports = router;
