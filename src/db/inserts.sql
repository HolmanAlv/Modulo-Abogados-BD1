/*==============================================================*/
/* Inserciones para Base de Datos - Gabinete de Abogados       */
/*==============================================================*/

/*==============================================================*/
/* Tabla: TIPOCONTACT                                           */
/*==============================================================*/
INSERT INTO TIPOCONTACT (IDTIPOCONTA, DESCTIPOCONTA) VALUES ('001', 'Correo Electrónico');
INSERT INTO TIPOCONTACT (IDTIPOCONTA, DESCTIPOCONTA) VALUES ('002', 'Teléfono Móvil');
INSERT INTO TIPOCONTACT (IDTIPOCONTA, DESCTIPOCONTA) VALUES ('003', 'Teléfono Fijo');

/*==============================================================*/
/* Tabla: TIPODOCUMENTO                                         */
/*==============================================================*/
INSERT INTO TIPODOCUMENTO (IDTIPODOC, DESCTIPODOC) VALUES ('01', 'Cédula de Ciudadanía');
INSERT INTO TIPODOCUMENTO (IDTIPODOC, DESCTIPODOC) VALUES ('02', 'Cédula de Extranjería');
INSERT INTO TIPODOCUMENTO (IDTIPODOC, DESCTIPODOC) VALUES ('03', 'NIT');

/*==============================================================*/
/* Tabla: TIPOLUGAR                                             */
/*==============================================================*/
INSERT INTO TIPOLUGAR (IDTIPOLUGAR, DESCTIPOLUGAR) VALUES ('0001', 'Juzgado Civil');
INSERT INTO TIPOLUGAR (IDTIPOLUGAR, DESCTIPOLUGAR) VALUES ('0002', 'Juzgado Penal');
INSERT INTO TIPOLUGAR (IDTIPOLUGAR, DESCTIPOLUGAR) VALUES ('0003', 'Tribunal Superior');

/*==============================================================*/
/* Tabla: FORMAPAGO                                             */
/*==============================================================*/
INSERT INTO FORMAPAGO (IDFORMAPAGO, DESCFORMAPAGO) VALUES ('001', 'Efectivo');
INSERT INTO FORMAPAGO (IDFORMAPAGO, DESCFORMAPAGO) VALUES ('002', 'Transferencia Bancaria');
INSERT INTO FORMAPAGO (IDFORMAPAGO, DESCFORMAPAGO) VALUES ('003', 'Tarjeta de Crédito');

/*==============================================================*/
/* Tabla: FRANQUICIA                                            */
/*==============================================================*/
INSERT INTO FRANQUICIA (CODFRANQUICIA, NOMFRANQUICIA) VALUES ('001', 'Visa');
INSERT INTO FRANQUICIA (CODFRANQUICIA, NOMFRANQUICIA) VALUES ('002', 'MasterCard');
INSERT INTO FRANQUICIA (CODFRANQUICIA, NOMFRANQUICIA) VALUES ('003', 'American Express');

/*==============================================================*/
/* Tabla: ESPECIALIZACION                                       */
/*==============================================================*/
INSERT INTO ESPECIALIZACION (CODESPECIALIZACION, NOMESPECIALIZACION) VALUES ('001', 'Derecho Civil');
INSERT INTO ESPECIALIZACION (CODESPECIALIZACION, NOMESPECIALIZACION) VALUES ('002', 'Derecho Penal');
INSERT INTO ESPECIALIZACION (CODESPECIALIZACION, NOMESPECIALIZACION) VALUES ('003', 'Derecho Laboral');

/*==============================================================*/
/* Tabla: ETAPAPROCESAL                                         */
/*==============================================================*/
INSERT INTO ETAPAPROCESAL (CODETAPA, NOMETAPA) VALUES ('001', 'Demanda');
INSERT INTO ETAPAPROCESAL (CODETAPA, NOMETAPA) VALUES ('002', 'Contestación');
INSERT INTO ETAPAPROCESAL (CODETAPA, NOMETAPA) VALUES ('003', 'Pruebas');
INSERT INTO ETAPAPROCESAL (CODETAPA, NOMETAPA) VALUES ('004', 'Alegatos');
INSERT INTO ETAPAPROCESAL (CODETAPA, NOMETAPA) VALUES ('005', 'Sentencia');

/*==============================================================*/
/* Tabla: IMPUGNACION                                           */
/*==============================================================*/
INSERT INTO IMPUGNACION (IDIMPUGNA, NOMIMPUGNA) VALUES ('01', 'Recurso de Apelación');
INSERT INTO IMPUGNACION (IDIMPUGNA, NOMIMPUGNA) VALUES ('02', 'Recurso de Casación');
INSERT INTO IMPUGNACION (IDIMPUGNA, NOMIMPUGNA) VALUES ('03', 'Recurso de Reposición');

/*==============================================================*/
/* Tabla: INSTANCIA                                             */
/*==============================================================*/
INSERT INTO INSTANCIA (NINSTANCIA) VALUES (1);
INSERT INTO INSTANCIA (NINSTANCIA) VALUES (2);
INSERT INTO INSTANCIA (NINSTANCIA) VALUES (3);

/*==============================================================*/
/* Tabla: ESPECIA_ETAPA                                         */
/* Especialización 001 - Derecho Civil                          */
/*==============================================================*/
-- Etapa 1: Demanda (Primera Instancia)
INSERT INTO ESPECIA_ETAPA (CODESPECIALIZACION, PASOETAPA, IDIMPUGNA, CODETAPA, NINSTANCIA) VALUES ('001', 1, NULL, '001', 1);
-- Etapa 2: Contestación (Primera Instancia)
INSERT INTO ESPECIA_ETAPA (CODESPECIALIZACION, PASOETAPA, IDIMPUGNA, CODETAPA, NINSTANCIA) VALUES ('001', 2, NULL, '002', 1);
-- Etapa 3: Pruebas (Primera Instancia)
INSERT INTO ESPECIA_ETAPA (CODESPECIALIZACION, PASOETAPA, IDIMPUGNA, CODETAPA, NINSTANCIA) VALUES ('001', 3, NULL, '003', 1);
-- Etapa 4: Alegatos (Primera Instancia)
INSERT INTO ESPECIA_ETAPA (CODESPECIALIZACION, PASOETAPA, IDIMPUGNA, CODETAPA, NINSTANCIA) VALUES ('001', 4, NULL, '004', 1);
-- Etapa 5: Sentencia (Primera Instancia)
INSERT INTO ESPECIA_ETAPA (CODESPECIALIZACION, PASOETAPA, IDIMPUGNA, CODETAPA, NINSTANCIA) VALUES ('001', 5, NULL, '005', 1);
-- Etapa 6: Recurso de Apelación (Segunda Instancia)
INSERT INTO ESPECIA_ETAPA (CODESPECIALIZACION, PASOETAPA, IDIMPUGNA, CODETAPA, NINSTANCIA) VALUES ('001', 6, '01', '001', 2);
-- Etapa 7: Sentencia Segunda Instancia
INSERT INTO ESPECIA_ETAPA (CODESPECIALIZACION, PASOETAPA, IDIMPUGNA, CODETAPA, NINSTANCIA) VALUES ('001', 7, NULL, '005', 2);
-- Etapa 8: Recurso de Casación (Tercera Instancia)
INSERT INTO ESPECIA_ETAPA (CODESPECIALIZACION, PASOETAPA, IDIMPUGNA, CODETAPA, NINSTANCIA) VALUES ('001', 8, '02', '001', 3);
-- Etapa 9: Sentencia Tercera Instancia
INSERT INTO ESPECIA_ETAPA (CODESPECIALIZACION, PASOETAPA, IDIMPUGNA, CODETAPA, NINSTANCIA) VALUES ('001', 9, NULL, '005', 3);

/*==============================================================*/
/* Especialización 002 - Derecho Penal                          */
/*==============================================================*/
-- Etapa 1: Demanda/Acusación (Primera Instancia)
INSERT INTO ESPECIA_ETAPA (CODESPECIALIZACION, PASOETAPA, IDIMPUGNA, CODETAPA, NINSTANCIA) VALUES ('002', 1, NULL, '001', 1);
-- Etapa 2: Contestación (Primera Instancia)
INSERT INTO ESPECIA_ETAPA (CODESPECIALIZACION, PASOETAPA, IDIMPUGNA, CODETAPA, NINSTANCIA) VALUES ('002', 2, NULL, '002', 1);
-- Etapa 3: Pruebas (Primera Instancia)
INSERT INTO ESPECIA_ETAPA (CODESPECIALIZACION, PASOETAPA, IDIMPUGNA, CODETAPA, NINSTANCIA) VALUES ('002', 3, NULL, '003', 1);
-- Etapa 4: Alegatos (Primera Instancia)
INSERT INTO ESPECIA_ETAPA (CODESPECIALIZACION, PASOETAPA, IDIMPUGNA, CODETAPA, NINSTANCIA) VALUES ('002', 4, NULL, '004', 1);
-- Etapa 5: Sentencia (Primera Instancia)
INSERT INTO ESPECIA_ETAPA (CODESPECIALIZACION, PASOETAPA, IDIMPUGNA, CODETAPA, NINSTANCIA) VALUES ('002', 5, NULL, '005', 1);
-- Etapa 6: Recurso de Apelación (Segunda Instancia)
INSERT INTO ESPECIA_ETAPA (CODESPECIALIZACION, PASOETAPA, IDIMPUGNA, CODETAPA, NINSTANCIA) VALUES ('002', 6, '01', '001', 2);
-- Etapa 7: Sentencia Segunda Instancia
INSERT INTO ESPECIA_ETAPA (CODESPECIALIZACION, PASOETAPA, IDIMPUGNA, CODETAPA, NINSTANCIA) VALUES ('002', 7, NULL, '005', 2);
-- Etapa 8: Recurso de Casación (Tercera Instancia)
INSERT INTO ESPECIA_ETAPA (CODESPECIALIZACION, PASOETAPA, IDIMPUGNA, CODETAPA, NINSTANCIA) VALUES ('002', 8, '02', '001', 3);
-- Etapa 9: Sentencia Tercera Instancia
INSERT INTO ESPECIA_ETAPA (CODESPECIALIZACION, PASOETAPA, IDIMPUGNA, CODETAPA, NINSTANCIA) VALUES ('002', 9, NULL, '005', 3);

/*==============================================================*/
/* Especialización 003 - Derecho Laboral                        */
/*==============================================================*/
-- Etapa 1: Demanda Laboral (Primera Instancia)
INSERT INTO ESPECIA_ETAPA (CODESPECIALIZACION, PASOETAPA, IDIMPUGNA, CODETAPA, NINSTANCIA) VALUES ('003', 1, NULL, '001', 1);
-- Etapa 2: Contestación (Primera Instancia)
INSERT INTO ESPECIA_ETAPA (CODESPECIALIZACION, PASOETAPA, IDIMPUGNA, CODETAPA, NINSTANCIA) VALUES ('003', 2, NULL, '002', 1);
-- Etapa 3: Pruebas (Primera Instancia)
INSERT INTO ESPECIA_ETAPA (CODESPECIALIZACION, PASOETAPA, IDIMPUGNA, CODETAPA, NINSTANCIA) VALUES ('003', 3, NULL, '003', 1);
-- Etapa 4: Alegatos (Primera Instancia)
INSERT INTO ESPECIA_ETAPA (CODESPECIALIZACION, PASOETAPA, IDIMPUGNA, CODETAPA, NINSTANCIA) VALUES ('003', 4, NULL, '004', 1);
-- Etapa 5: Sentencia (Primera Instancia)
INSERT INTO ESPECIA_ETAPA (CODESPECIALIZACION, PASOETAPA, IDIMPUGNA, CODETAPA, NINSTANCIA) VALUES ('003', 5, NULL, '005', 1);
-- Etapa 6: Recurso de Apelación (Segunda Instancia)
INSERT INTO ESPECIA_ETAPA (CODESPECIALIZACION, PASOETAPA, IDIMPUGNA, CODETAPA, NINSTANCIA) VALUES ('003', 6, '01', '001', 2);
-- Etapa 7: Sentencia Segunda Instancia
INSERT INTO ESPECIA_ETAPA (CODESPECIALIZACION, PASOETAPA, IDIMPUGNA, CODETAPA, NINSTANCIA) VALUES ('003', 7, NULL, '005', 2);
-- Etapa 8: Recurso de Reposición
INSERT INTO ESPECIA_ETAPA (CODESPECIALIZACION, PASOETAPA, IDIMPUGNA, CODETAPA, NINSTANCIA) VALUES ('003', 8, '03', '001', 2);
-- Etapa 9: Recurso de Casación (Tercera Instancia)
INSERT INTO ESPECIA_ETAPA (CODESPECIALIZACION, PASOETAPA, IDIMPUGNA, CODETAPA, NINSTANCIA) VALUES ('003', 9, '02', '001', 3);

/*==============================================================*/
/* Tabla: ABOGADO                                               */
/*==============================================================*/
INSERT INTO ABOGADO (CEDULA, NOMBRE, APELLIDO, NTARJETAPROFESIONAL) VALUES ('1010123456', 'Carlos', 'Martínez López', '12345');
INSERT INTO ABOGADO (CEDULA, NOMBRE, APELLIDO, NTARJETAPROFESIONAL) VALUES ('1020234567', 'María', 'González Pérez', '23456');
INSERT INTO ABOGADO (CEDULA, NOMBRE, APELLIDO, NTARJETAPROFESIONAL) VALUES ('1030345678', 'Juan', 'Rodríguez Silva', '34567');
INSERT INTO ABOGADO (CEDULA, NOMBRE, APELLIDO, NTARJETAPROFESIONAL) VALUES ('1040456789', 'Ana', 'Fernández Torres', '45678');
INSERT INTO ABOGADO (CEDULA, NOMBRE, APELLIDO, NTARJETAPROFESIONAL) VALUES ('1050567890', 'Luis', 'Ramírez Castro', '56789');
INSERT INTO ABOGADO (CEDULA, NOMBRE, APELLIDO, NTARJETAPROFESIONAL) VALUES ('1060678901', 'Patricia', 'Sánchez Moreno', '67890');
INSERT INTO ABOGADO (CEDULA, NOMBRE, APELLIDO, NTARJETAPROFESIONAL) VALUES ('1070789012', 'Roberto', 'Díaz Vargas', '78901');
INSERT INTO ABOGADO (CEDULA, NOMBRE, APELLIDO, NTARJETAPROFESIONAL) VALUES ('1080890123', 'Laura', 'Herrera Ruiz', '89012');
INSERT INTO ABOGADO (CEDULA, NOMBRE, APELLIDO, NTARJETAPROFESIONAL) VALUES ('1090901234', 'Miguel', 'Ortiz Medina', '90123');
INSERT INTO ABOGADO (CEDULA, NOMBRE, APELLIDO, NTARJETAPROFESIONAL) VALUES ('1101012345', 'Sofia', 'Mendoza Ríos', '01234');

/*==============================================================*/
/* Tabla: CLIENTE                                               */
/*==============================================================*/
INSERT INTO CLIENTE (CODCLIENTE, IDTIPODOC, NOMCLIENTE, APELLCLIENTE, NDOCUMENTO) VALUES ('00001', '01', 'Pedro', 'Gómez Salazar', '1234567890');
INSERT INTO CLIENTE (CODCLIENTE, IDTIPODOC, NOMCLIENTE, APELLCLIENTE, NDOCUMENTO) VALUES ('00002', '01', 'Sandra', 'López Martínez', '2345678901');
INSERT INTO CLIENTE (CODCLIENTE, IDTIPODOC, NOMCLIENTE, APELLCLIENTE, NDOCUMENTO) VALUES ('00003', '02', 'James', 'Smith Johnson', 'CE123456789');
INSERT INTO CLIENTE (CODCLIENTE, IDTIPODOC, NOMCLIENTE, APELLCLIENTE, NDOCUMENTO) VALUES ('00004', '03', 'Empresa ABC', 'S.A.S.', '900123456-1');
INSERT INTO CLIENTE (CODCLIENTE, IDTIPODOC, NOMCLIENTE, APELLCLIENTE, NDOCUMENTO) VALUES ('00005', '01', 'Carolina', 'Pérez Duarte', '3456789012');

/*==============================================================*/
/* Tabla: LUGAR - Ciudades (Nivel Superior)                     */
/*==============================================================*/
INSERT INTO LUGAR (CODLUGAR, LUG_CODLUGAR, IDTIPOLUGAR, NOMLUGAR, DIRELUGAR, TELLUGAR, EMAILLUGAR) VALUES ('00001', NULL, '0001', 'Bogotá D.C.', 'Calle 12 #7-65', '6013334455', 'info@bogota.gov.co');
INSERT INTO LUGAR (CODLUGAR, LUG_CODLUGAR, IDTIPOLUGAR, NOMLUGAR, DIRELUGAR, TELLUGAR, EMAILLUGAR) VALUES ('00002', NULL, '0001', 'Medellín', 'Carrera 50 #52-43', '6044445566', 'info@medellin.gov.co');
INSERT INTO LUGAR (CODLUGAR, LUG_CODLUGAR, IDTIPOLUGAR, NOMLUGAR, DIRELUGAR, TELLUGAR, EMAILLUGAR) VALUES ('00003', NULL, '0001', 'Cali', 'Avenida 2N #10-70', '6025556677', 'info@cali.gov.co');

/*==============================================================*/
/* Tabla: LUGAR - Juzgados Civiles                              */
/*==============================================================*/
INSERT INTO LUGAR (CODLUGAR, LUG_CODLUGAR, IDTIPOLUGAR, NOMLUGAR, DIRELUGAR, TELLUGAR, EMAILLUGAR) VALUES ('00101', '00001', '0001', 'Juzgado 1 Civil Bogotá', 'Calle 12 #7-65 Piso 3', '6013334456', 'juzgado1civil@rama.gov.co');
INSERT INTO LUGAR (CODLUGAR, LUG_CODLUGAR, IDTIPOLUGAR, NOMLUGAR, DIRELUGAR, TELLUGAR, EMAILLUGAR) VALUES ('00102', '00002', '0001', 'Juzgado 2 Civil Medellín', 'Carrera 50 #52-43 Of 201', '6044445567', 'juzgado2civil@rama.gov.co');
INSERT INTO LUGAR (CODLUGAR, LUG_CODLUGAR, IDTIPOLUGAR, NOMLUGAR, DIRELUGAR, TELLUGAR, EMAILLUGAR) VALUES ('00103', '00003', '0001', 'Juzgado 3 Civil Cali', 'Avenida 2N #10-70 Torre A', '6025556678', 'juzgado3civil@rama.gov.co');

/*==============================================================*/
/* Tabla: LUGAR - Juzgados Penales                              */
/*==============================================================*/
INSERT INTO LUGAR (CODLUGAR, LUG_CODLUGAR, IDTIPOLUGAR, NOMLUGAR, DIRELUGAR, TELLUGAR, EMAILLUGAR) VALUES ('00201', '00001', '0002', 'Juzgado 1 Penal Bogotá', 'Calle 12 #7-65 Piso 5', '6013334457', 'juzgado1penal@rama.gov.co');
INSERT INTO LUGAR (CODLUGAR, LUG_CODLUGAR, IDTIPOLUGAR, NOMLUGAR, DIRELUGAR, TELLUGAR, EMAILLUGAR) VALUES ('00202', '00002', '0002', 'Juzgado 2 Penal Medellín', 'Carrera 50 #52-43 Of 301', '6044445568', 'juzgado2penal@rama.gov.co');
INSERT INTO LUGAR (CODLUGAR, LUG_CODLUGAR, IDTIPOLUGAR, NOMLUGAR, DIRELUGAR, TELLUGAR, EMAILLUGAR) VALUES ('00203', '00003', '0002', 'Juzgado 3 Penal Cali', 'Avenida 2N #10-70 Torre B', '6025556679', 'juzgado3penal@rama.gov.co');

/*==============================================================*/
/* Tabla: LUGAR - Tribunales Superiores                         */
/*==============================================================*/
INSERT INTO LUGAR (CODLUGAR, LUG_CODLUGAR, IDTIPOLUGAR, NOMLUGAR, DIRELUGAR, TELLUGAR, EMAILLUGAR) VALUES ('00301', '00001', '0003', 'Tribunal Superior Bogotá', 'Calle 11 #9A-24', '6013338899', 'tribunalbogota@rama.gov.co');
INSERT INTO LUGAR (CODLUGAR, LUG_CODLUGAR, IDTIPOLUGAR, NOMLUGAR, DIRELUGAR, TELLUGAR, EMAILLUGAR) VALUES ('00302', '00002', '0003', 'Tribunal Superior Medellín', 'Carrera 53 #49-20', '6044449900', 'tribunalmedellin@rama.gov.co');
INSERT INTO LUGAR (CODLUGAR, LUG_CODLUGAR, IDTIPOLUGAR, NOMLUGAR, DIRELUGAR, TELLUGAR, EMAILLUGAR) VALUES ('00303', '00003', '0003', 'Tribunal Superior Cali', 'Calle 13 #3-33', '6025550011', 'tribunalcali@rama.gov.co');

/*==============================================================*/
/* Tabla: INSTANCIA - Instancias adicionales                    */
/*==============================================================*/
INSERT INTO INSTANCIA (NINSTANCIA) VALUES (4);
INSERT INTO INSTANCIA (NINSTANCIA) VALUES (5);
INSERT INTO INSTANCIA (NINSTANCIA) VALUES (6);

/*==============================================================*/
/* CASO HIPOTÉTICO COMPLETO                                     */
/* Caso Civil: Demanda por incumplimiento de contrato          */
/*==============================================================*/

/*==============================================================*/
/* Tabla: CASO                                                  */
/*==============================================================*/
INSERT INTO CASO (NOCASO, CODCLIENTE, CODESPECIALIZACION, FECHAINICIO, FECHAFIN, VALOR) 
VALUES (10001, '00001', '001', TO_DATE('2024-01-15', 'YYYY-MM-DD'), NULL, '50000000');

/*==============================================================*/
/* Tabla: CONTACTO - Cliente del caso                           */
/*==============================================================*/
INSERT INTO CONTACTO (CODCLIENTE, CONSECONTACTO, IDTIPOCONTA, VALORCONTACTO, NOTIFICACION) 
VALUES ('00001', 1, '001', 'pedro.gomez@email.com', 1);
INSERT INTO CONTACTO (CODCLIENTE, CONSECONTACTO, IDTIPOCONTA, VALORCONTACTO, NOTIFICACION) 
VALUES ('00001', 2, '002', '3101234567', 1);

/*==============================================================*/
/* Tabla: EXPEDIENTE - Etapa 1: Demanda (sin abogado)          */
/*==============================================================*/
INSERT INTO EXPEDIENTE (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CODLUGAR, CEDULA, FECHAETAPA) 
VALUES ('001', 1, 10001, 1, '00101', NULL, TO_DATE('2024-01-15', 'YYYY-MM-DD'));

/*==============================================================*/
/* Tabla: DOCUMENTO - Documentos de la Demanda                  */
/*==============================================================*/
INSERT INTO DOCUMENTO (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CONDOC, UBICADOC) 
VALUES ('001', 1, 10001, 1, 1, '/docs/caso10001/demanda_principal.pdf');
INSERT INTO DOCUMENTO (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CONDOC, UBICADOC) 
VALUES ('001', 1, 10001, 1, 2, '/docs/caso10001/pruebas_contrato.pdf');

/*==============================================================*/
/* Tabla: SUCESO - Eventos de la Demanda                        */
/*==============================================================*/
INSERT INTO SUCESO (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CONSUCESO, DESCSUCESO) 
VALUES ('001', 1, 10001, 1, 1, 'Radicación de demanda por incumplimiento contractual ante Juzgado 1 Civil de Bogotá');
INSERT INTO SUCESO (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CONSUCESO, DESCSUCESO) 
VALUES ('001', 1, 10001, 1, 2, 'Admisión de la demanda y notificación a la parte demandada');

/*==============================================================*/
/* Tabla: EXPEDIENTE - Etapa 2: Contestación (con abogado)     */
/*==============================================================*/
INSERT INTO EXPEDIENTE (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CODLUGAR, CEDULA, FECHAETAPA) 
VALUES ('001', 2, 10001, 1, '00101', '1010123456', TO_DATE('2024-02-20', 'YYYY-MM-DD'));

/*==============================================================*/
/* Tabla: DOCUMENTO - Documentos de la Contestación             */
/*==============================================================*/
INSERT INTO DOCUMENTO (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CONDOC, UBICADOC) 
VALUES ('001', 2, 10001, 1, 1, '/docs/caso10001/contestacion_demanda.pdf');

/*==============================================================*/
/* Tabla: SUCESO - Eventos de la Contestación                   */
/*==============================================================*/
INSERT INTO SUCESO (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CONSUCESO, DESCSUCESO) 
VALUES ('001', 2, 10001, 1, 1, 'Presentación de contestación de demanda por parte del demandado');
INSERT INTO SUCESO (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CONSUCESO, DESCSUCESO) 
VALUES ('001', 2, 10001, 1, 2, 'El abogado Carlos Martínez asume la representación del caso');

/*==============================================================*/
/* Tabla: EXPEDIENTE - Etapa 3: Pruebas                         */
/*==============================================================*/
INSERT INTO EXPEDIENTE (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CODLUGAR, CEDULA, FECHAETAPA) 
VALUES ('001', 3, 10001, 1, '00101', '1010123456', TO_DATE('2024-04-10', 'YYYY-MM-DD'));

/*==============================================================*/
/* Tabla: DOCUMENTO - Documentos de Pruebas                     */
/*==============================================================*/
INSERT INTO DOCUMENTO (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CONDOC, UBICADOC) 
VALUES ('001', 3, 10001, 1, 1, '/docs/caso10001/testimonios.pdf');
INSERT INTO DOCUMENTO (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CONDOC, UBICADOC) 
VALUES ('001', 3, 10001, 1, 2, '/docs/caso10001/peritaje_contable.pdf');
INSERT INTO DOCUMENTO (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CONDOC, UBICADOC) 
VALUES ('001', 3, 10001, 1, 3, '/docs/caso10001/documentos_adicionales.pdf');

/*==============================================================*/
/* Tabla: SUCESO - Eventos de Pruebas                           */
/*==============================================================*/
INSERT INTO SUCESO (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CONSUCESO, DESCSUCESO) 
VALUES ('001', 3, 10001, 1, 1, 'Decreto y práctica de pruebas testimoniales');
INSERT INTO SUCESO (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CONSUCESO, DESCSUCESO) 
VALUES ('001', 3, 10001, 1, 2, 'Realización de peritaje contable por experto designado');

/*==============================================================*/
/* Tabla: EXPEDIENTE - Etapa 4: Alegatos                        */
/*==============================================================*/
INSERT INTO EXPEDIENTE (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CODLUGAR, CEDULA, FECHAETAPA) 
VALUES ('001', 4, 10001, 1, '00101', '1010123456', TO_DATE('2024-06-15', 'YYYY-MM-DD'));

/*==============================================================*/
/* Tabla: DOCUMENTO - Documentos de Alegatos                    */
/*==============================================================*/
INSERT INTO DOCUMENTO (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CONDOC, UBICADOC) 
VALUES ('001', 4, 10001, 1, 1, '/docs/caso10001/alegatos_conclusion.pdf');

/*==============================================================*/
/* Tabla: SUCESO - Eventos de Alegatos                          */
/*==============================================================*/
INSERT INTO SUCESO (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CONSUCESO, DESCSUCESO) 
VALUES ('001', 4, 10001, 1, 1, 'Presentación de alegatos de conclusión por ambas partes');

/*==============================================================*/
/* Tabla: EXPEDIENTE - Etapa 5: Sentencia Primera Instancia    */
/*==============================================================*/
INSERT INTO EXPEDIENTE (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CODLUGAR, CEDULA, FECHAETAPA) 
VALUES ('001', 5, 10001, 1, '00101', '1010123456', TO_DATE('2024-08-20', 'YYYY-MM-DD'));

/*==============================================================*/
/* Tabla: DOCUMENTO - Documentos de Sentencia                   */
/*==============================================================*/
INSERT INTO DOCUMENTO (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CONDOC, UBICADOC) 
VALUES ('001', 5, 10001, 1, 1, '/docs/caso10001/sentencia_primera_instancia.pdf');

/*==============================================================*/
/* Tabla: RESULTADO - Resultado Primera Instancia               */
/*==============================================================*/
INSERT INTO RESULTADO (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CONRESUL, DESCRESUL) 
VALUES ('001', 5, 10001, 1, 1, 'Sentencia favorable al demandante. Se condena al demandado al pago de $50.000.000 por incumplimiento contractual más intereses moratorios.');

/*==============================================================*/
/* Tabla: SUCESO - Eventos de Sentencia                         */
/*==============================================================*/
INSERT INTO SUCESO (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CONSUCESO, DESCSUCESO) 
VALUES ('001', 5, 10001, 1, 1, 'Proferida sentencia de primera instancia a favor del demandante');
INSERT INTO SUCESO (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CONSUCESO, DESCSUCESO) 
VALUES ('001', 5, 10001, 1, 2, 'Notificación de la sentencia a las partes procesales');

/*==============================================================*/
/* Tabla: EXPEDIENTE - Etapa 6: Recurso de Apelación           */
/*==============================================================*/
INSERT INTO EXPEDIENTE (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CODLUGAR, CEDULA, FECHAETAPA) 
VALUES ('001', 6, 10001, 1, '00301', '1010123456', TO_DATE('2024-09-05', 'YYYY-MM-DD'));

/*==============================================================*/
/* Tabla: DOCUMENTO - Documentos de Apelación                   */
/*==============================================================*/
INSERT INTO DOCUMENTO (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CONDOC, UBICADOC) 
VALUES ('001', 6, 10001, 1, 1, '/docs/caso10001/recurso_apelacion.pdf');

/*==============================================================*/
/* Tabla: SUCESO - Eventos de Apelación                         */
/*==============================================================*/
INSERT INTO SUCESO (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CONSUCESO, DESCSUCESO) 
VALUES ('001', 6, 10001, 1, 1, 'Presentación de recurso de apelación por parte del demandado');
INSERT INTO SUCESO (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CONSUCESO, DESCSUCESO) 
VALUES ('001', 6, 10001, 1, 2, 'Remisión del expediente al Tribunal Superior de Bogotá');

/*==============================================================*/
/* Tabla: EXPEDIENTE - Etapa 7: Sentencia Segunda Instancia    */
/*==============================================================*/
INSERT INTO EXPEDIENTE (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CODLUGAR, CEDULA, FECHAETAPA) 
VALUES ('001', 7, 10001, 1, '00301', '1010123456', TO_DATE('2024-11-10', 'YYYY-MM-DD'));

/*==============================================================*/
/* Tabla: DOCUMENTO - Documentos Sentencia Segunda Instancia   */
/*==============================================================*/
INSERT INTO DOCUMENTO (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CONDOC, UBICADOC) 
VALUES ('001', 7, 10001, 1, 1, '/docs/caso10001/sentencia_segunda_instancia.pdf');

/*==============================================================*/
/* Tabla: RESULTADO - Resultado Segunda Instancia               */
/*==============================================================*/
INSERT INTO RESULTADO (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CONRESUL, DESCRESUL) 
VALUES ('001', 7, 10001, 1, 1, 'Se confirma la sentencia de primera instancia. Queda en firme la condena al demandado.');

/*==============================================================*/
/* Tabla: SUCESO - Eventos Sentencia Segunda Instancia         */
/*==============================================================*/
INSERT INTO SUCESO (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CONSUCESO, DESCSUCESO) 
VALUES ('001', 7, 10001, 1, 1, 'El Tribunal Superior confirma la sentencia de primera instancia');
INSERT INTO SUCESO (CODESPECIALIZACION, PASOETAPA, NOCASO, CONSECEXPE, CONSUCESO, DESCSUCESO) 
VALUES ('001', 7, 10001, 1, 2, 'Sentencia ejecutoriada. Caso concluido favorablemente para el cliente');

COMMIT;
