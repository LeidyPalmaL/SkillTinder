SELECT 
	n."Id",
    Concat(p."FirstNames", ' ', p."SurNames") As "Professional",
    c."Name" As "Company",
    pr."Title" As "Project", 
    n."Date", 
    n."Duration", 
    n."Cost"
FROM 
    public."Negotiations" n
INNER JOIN
    public."Professionals" p
ON
    p."Id" = n."Professional"
INNER JOIN
    public."Companies" c
ON
    c."Id" = n."Company"
INNER JOIN
    public."Projects" pr
ON
    pr."Id" = n."Project"


