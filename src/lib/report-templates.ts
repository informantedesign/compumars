
export const DEFAULT_AUTHORIZATION_TEMPLATE = `
<div style="font-family: Arial, sans-serif; max-width: 21cm; margin: 0 auto; padding: 40px; color: black; line-height: 1.5;">
    <!-- HEADER -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px;">
        <div style="width: 40%;">
            <h1 style="font-size: 28px; font-weight: 900; color: #b91c1c; margin: 0; line-height: 1;">CSC</h1>
            <h2 style="font-size: 14px; font-weight: bold; color: #dc2626; margin: 5px 0 0 0;">Corporación<br>Socialista<br>del Cemento, S.A.</h2>
            <p style="font-size: 10px; font-weight: bold; margin-top: 5px;">RIF: {{COMPANY_RIF}}</p>
        </div>
        <div style="text-align: right; font-size: 14px;">
            <p>Caracas, {{DATE}}</p>
        </div>
    </div>

    <!-- ATTENTION -->
    <div style="margin-bottom: 25px;">
        <p style="font-weight: bold; margin: 0;">Atención:</p>
        <p style="font-weight: bold; margin: 0;">Sres. Corporación Socialista del Cemento, C.A.</p>
    </div>

    <!-- TITLE -->
    <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="font-size: 18px; font-weight: bold; text-decoration: underline; margin: 0;">AUTORIZACIÓN DE CARGA</h2>
        <p style="font-size: 14px; font-weight: bold; margin-top: 5px;">PEDIDO N° {{PLANT_ORDER_NO}}</p>
    </div>

    <!-- BODY -->
    <div style="text-align: justify; font-size: 14px; margin-bottom: 25px;">
        <p>
            Quien suscribe <strong>{{ISSUER_NAME}}</strong> titular de la cedula de identidad N° <strong>{{ISSUER_ID}}</strong>,
            en mi condición de <strong>{{ISSUER_ROLE}}</strong> de la empresa <strong>{{COMPANY_NAME}}</strong>, RIF: <strong>{{COMPANY_RIF}}</strong>
            por medio de la presente autorizo al ciudadano <strong>{{DRIVER_NAME}}</strong>, titular de la cedula de identidad N° <strong>{{DRIVER_ID}}</strong>
            a realizar el retiro del producto <strong>{{PRODUCT_NAME}}</strong> en la presentación de <strong>GRANEL</strong> por la planta <strong>{{ORIGIN}}</strong>
            anexan los datos del Vehículo, número(s) de pedido(s) y dirección destino.
        </p>
    </div>

    <!-- TABLE 1 -->
    <div style="border: 1px solid black; margin-bottom: 25px; font-size: 14px;">
        <div style="background-color: #e5e7eb; border-bottom: 1px solid black; font-weight: bold; text-align: center; padding: 5px;">
            SIRVA DESPACHAR POR NUESTRA CUENTA LO SIGUIENTE
        </div>
        <div>
            <div style="display: flex; border-bottom: 1px solid black;">
                <div style="width: 35%; border-right: 1px solid black; padding: 5px;">Código Cliente y Obra</div>
                <div style="width: 65%; padding: 5px;">9117513 ({{CLIENT_NAME}})</div>
            </div>
            <div style="display: flex; border-bottom: 1px solid black;">
                <div style="width: 35%; border-right: 1px solid black; padding: 5px;">N° de oferta de venta</div>
                <div style="width: 65%; padding: 5px;">680192</div>
            </div>
            <div style="display: flex; border-bottom: 1px solid black;">
                <div style="width: 35%; border-right: 1px solid black; padding: 5px;">Descripción</div>
                <div style="width: 65%; padding: 5px;">{{PRODUCT_NAME}}</div>
            </div>
            <div style="display: flex; border-bottom: 1px solid black;">
                <div style="width: 35%; border-right: 1px solid black; padding: 5px;">Cantidad</div>
                <div style="width: 65%; padding: 5px;">{{QUANTITY}}</div>
            </div>
            <div style="display: flex;">
                <div style="width: 35%; border-right: 1px solid black; padding: 5px;">N° de pedido (s)</div>
                <div style="width: 65%; padding: 5px; font-weight: bold;">{{PLANT_ORDER_NO}}</div>
            </div>
        </div>
    </div>

    <!-- TABLE 2 -->
    <div style="border: 1px solid black; margin-bottom: 25px; font-size: 14px;">
        <div style="background-color: #e5e7eb; border-bottom: 1px solid black; font-weight: bold; text-align: center; padding: 5px;">
            DIRECCION EXACTA DE LA OBRA
        </div>
        <div style="padding: 10px; text-transform: uppercase; border-bottom: 1px solid black; min-height: 40px;">
            {{DESTINATION_ADDRESS}}
        </div>
        <div style="display: flex; font-size: 12px; text-transform: uppercase;">
            <div style="width: 33.33%; padding: 5px; border-right: 1px solid black;">ESTADO: DTTO CAPITAL</div>
            <div style="width: 33.33%; padding: 5px; border-right: 1px solid black;">MUNICIPIO: LIBERTADOR</div>
            <div style="width: 33.33%; padding: 5px;">PARROQUIA: EL VALLE</div>
        </div>
    </div>

    <!-- TABLE 3 (VEHICLES) -->
    <div style="display: flex; gap: 20px; mb-16; font-size: 14px;">
        <!-- CHUTO -->
        <div style="width: 50%; border: 1px solid black;">
            <div style="background-color: #e5e7eb; border-bottom: 1px solid black; font-weight: bold; text-align: center; padding: 5px;">
                Datos del Vehículo (Chuto)
            </div>
            <div style="display: flex; border-bottom: 1px solid black;">
                <div style="width: 80px; padding: 5px; border-right: 1px solid black;">Marca</div>
                <div style="padding: 5px; font-weight: bold;">{{TRUCK_BRAND}}</div>
            </div>
            <div style="display: flex; border-bottom: 1px solid black;">
                <div style="width: 80px; padding: 5px; border-right: 1px solid black;">Placa</div>
                <div style="padding: 5px; font-weight: bold;">{{TRUCK_PLATE}}</div>
            </div>
            <div style="display: flex; border-bottom: 1px solid black;">
                <div style="width: 80px; padding: 5px; border-right: 1px solid black;">Modelo</div>
                <div style="padding: 5px;">{{TRUCK_MODEL}}</div>
            </div>
             <div style="display: flex; border-bottom: 1px solid black;">
                <div style="width: 80px; padding: 5px; border-right: 1px solid black;">Color</div>
                <div style="padding: 5px;">{{TRUCK_COLOR}}</div>
            </div>
        </div>

        <!-- BATEA -->
        <div style="width: 50%; border: 1px solid black;">
            <div style="background-color: #e5e7eb; border-bottom: 1px solid black; font-weight: bold; text-align: center; padding: 5px;">
                Datos del Vehículo (Plataforma)
            </div>
             <div style="display: flex; border-bottom: 1px solid black;">
                <div style="width: 80px; padding: 5px; border-right: 1px solid black;">Marca</div>
                <div style="padding: 5px;">{{TRAILER_BRAND}}</div>
            </div>
            <div style="display: flex; border-bottom: 1px solid black;">
                <div style="width: 80px; padding: 5px; border-right: 1px solid black;">Placa</div>
                <div style="padding: 5px; font-weight: bold;">{{TRAILER_PLATE}}</div>
            </div>
             <div style="display: flex; border-bottom: 1px solid black;">
                <div style="width: 80px; padding: 5px; border-right: 1px solid black;">Modelo</div>
                <div style="padding: 5px;">{{TRAILER_MODEL}}</div>
            </div>
            <div style="display: flex; border-bottom: 1px solid black;">
                <div style="width: 80px; padding: 5px; border-right: 1px solid black;">Color</div>
                <div style="padding: 5px;">{{TRAILER_COLOR}}</div>
            </div>
        </div>
    </div>

    <!-- SIGNATURES -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 60px;">
        <div style="text-align: center; width: 250px;">
             <div style="text-align: left; margin-bottom: 10px;">Atentamente,</div>
             <div style="border-bottom: 1px solid black; height: 50px; margin-bottom: 10px;"></div>
             <p style="font-weight: bold; font-size: 14px; margin: 0;">{{ISSUER_NAME}}</p>
             <p style="font-weight: bold; font-size: 12px; margin: 0;">{{ISSUER_ROLE}}</p>
             <p style="font-size: 12px; margin: 5px 0 0 0;">Teléfono: {{CONTACT_PHONE}}</p>
        </div>
        <div style="text-align: center; width: 250px;">
             <div style="border-bottom: 1px solid black; height: 50px; margin-bottom: 10px;"></div>
             <p style="font-weight: bold; font-size: 14px; margin: 0;">Sello de la empresa</p>
        </div>
    </div>
</div>
`;

export const DEFAULT_DELIVERY_TEMPLATE = `
<div style="font-family: Arial, sans-serif; max-width: 21cm; margin: 0 auto; padding: 40px; color: black; line-height: 1.5; border-top: 2px dashed #ccc;">
    <!-- HEADER -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 2px solid black; padding-bottom: 20px;">
        <div style="width: 50%;">
            <h1 style="font-size: 24px; font-weight: bold; margin: 0; text-transform: uppercase;">{{COMPANY_NAME}}</h1>
            <p style="font-size: 14px; margin: 5px 0 0 0;">RIF: {{COMPANY_RIF}}</p>
            <p style="font-size: 12px; margin: 5px 0 0 0;">Caracas, Venezuela</p>
        </div>
        <div style="text-align: right; width: 50%;">
            <h2 style="font-size: 22px; font-weight: bold; margin: 0;">NOTA DE ENTREGA</h2>
            <p style="font-size: 18px; font-family: monospace; margin: 5px 0;">N° {{PLANT_ORDER_NO}}</p>
            <p style="font-size: 14px; margin: 0;">Fecha: {{DATE}}</p>
        </div>
    </div>

    <!-- CLIENT INFO -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px;">
        <div>
            <h3 style="font-weight: bold; border-bottom: 1px solid #9ca3af; margin-bottom: 10px; padding-bottom: 5px;">Cliente</h3>
            <p style="font-weight: bold; margin: 0;">{{CLIENT_NAME}}</p>
            <p style="font-size: 14px; margin: 5px 0;">RIF: {{CLIENT_RIF}}</p>
             <p style="font-size: 14px; margin: 5px 0;">Telf: {{CLIENT_PHONE}}</p>
        </div>
        <div>
            <h3 style="font-weight: bold; border-bottom: 1px solid #9ca3af; margin-bottom: 10px; padding-bottom: 5px;">Destino</h3>
            <p style="font-size: 14px; margin: 0;">{{DESTINATION_ADDRESS}}</p>
        </div>
    </div>

    <!-- PRODUCT DETAILS -->
    <div style="margin-bottom: 40px;">
        <table style="width: 100%; border-collapse: collapse; border: 1px solid black;">
            <thead>
                <tr style="background-color: #e5e7eb;">
                    <th style="border: 1px solid black; padding: 10px; text-align: left;">Descripción</th>
                    <th style="border: 1px solid black; padding: 10px; text-align: center; width: 120px;">Cantidad</th>
                    <th style="border: 1px solid black; padding: 10px; text-align: center; width: 120px;">Unidad</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: 1px solid black; padding: 15px; font-weight: bold;">{{PRODUCT_NAME}}</td>
                    <td style="border: 1px solid black; padding: 15px; text-align: center; font-family: monospace; font-size: 18px;">{{QUANTITY_VAL}}</td>
                    <td style="border: 1px solid black; padding: 15px; text-align: center;">{{QUANTITY_UNIT}}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- TRANSPORT INFO -->
    <div style="border: 1px solid black; padding: 20px; margin-bottom: 40px;">
        <h3 style="font-weight: bold; margin: 0 0 10px 0; border-bottom: 1px solid #d1d5db; padding-bottom: 5px;">Datos de Transporte</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
            <div><span style="font-weight: bold;">Conductor:</span> {{DRIVER_NAME}}</div>
             <div><span style="font-weight: bold;">Cédula:</span> {{DRIVER_ID}}</div>
            <div><span style="font-weight: bold;">Placa Chuto:</span> {{TRUCK_PLATE}}</div>
            <div><span style="font-weight: bold;">Placa Remolque:</span> {{TRAILER_PLATE}}</div>
        </div>
    </div>

    <!-- FOOTER -->
    <div style="display: flex; justify-content: space-around; margin-top: 80px;">
        <div style="text-align: center; width: 250px;">
            <div style="border-bottom: 1px solid black; height: 1px; margin-bottom: 10px;"></div>
            <p style="font-weight: bold; font-size: 14px; margin: 0;">Recibido Conforme</p>
            <p style="font-size: 12px; color: #6b7280; margin: 5px 0;">(Nombre, Cédula y Firma)</p>
        </div>
        <div style="width: 250px; border: 1px solid black; height: 100px; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 10px;">
             <span style="font-size: 12px; font-weight: bold; color: #9ca3af; text-transform: uppercase;">Sello de la Empresa</span>
        </div>
    </div>
</div>
`;

export const DEFAULT_TRANSFER_GUIDE_TEMPLATE = `
<div style="font-family: Arial, sans-serif; max-width: 21cm; margin: 0 auto; padding: 40px; color: black; line-height: 1.5; font-size: 14px;">
    <!-- HEADER -->
    <div style="display: flex; align-items: flex-start; margin-bottom: 30px; gap: 20px;">
        <div style="width: 80px; height: 80px; background-color: #e5e7eb; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; text-align: center;">
            LOGO
        </div>
        <div style="flex: 1; text-align: center;">
            <p style="font-size: 12px; font-weight: bold; margin: 0; line-height: 1.2;">REPUBLICA BOLIVARIANA DE VENEZUELA<br>MINISTERIO DEL PODER POPULAR PARA LA DEFENSA<br>VICEMINISTERIO DE LOS SERVICIOS PERSONAL Y LOGISTICA<br>DIRECCIÓN GENERAL DE EMPRESAS Y SERVICIOS<br>EMPRESA CONSTRUCTORA DE LA FUERZA ARMADA NACIONAL BOLIVARIANA C.A</p>
        </div>
    </div>

    <div style="text-align: right; font-weight: bold; font-size: 14px; margin-bottom: 30px;">
        FECHA: {{DATE}}
    </div>

    <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="font-size: 20px; font-weight: bold; text-decoration: underline; text-transform: uppercase; margin: 0;">GUÍA DE TRASLADO</h2>
    </div>

    <!-- BODY -->
    <div style="text-align: justify; margin-bottom: 30px; font-weight: 500;">
        Quien suscribe, hace constar que él ciudadano <br>
        Nombre y Apellidos: <strong>{{DRIVER_NAME}}</strong> C.I. N° <strong>{{DRIVER_ID}}</strong> Este Autorizado para conducir el vehículo tipo: <strong>{{TRUCK_TYPE}}</strong> Marca: <strong>{{TRUCK_BRAND}}</strong> Placas o Serial: <strong>{{TRUCK_PLATE}}</strong> Color: <strong>{{TRUCK_COLOR}}</strong> Vehículo Plataforma Tipo: <strong>{{TRAILER_TYPE}}</strong> Placa <strong>{{TRAILER_PLATE}}</strong> Con la finalidad de Efectuar Comisión: TRASLADO DE <strong>{{QUANTITY}}</strong> DE <strong>{{PRODUCT_NAME}}</strong> PARA OBRAS DEL MINISTERIO DEL PODER POPULAR PARA LA DEFENSA.
    </div>

    <div style="font-weight: bold; font-size: 14px; margin-bottom: 30px;">
        Desde el: {{DATE}}
    </div>

    <!-- TABLE -->
    <div style="margin-bottom: 50px;">
        <table style="width: 100%; border-collapse: collapse; border: 1px solid black;">
            <thead>
                <tr>
                    <th style="border: 1px solid black; padding: 8px; text-align: center; width: 50px;">N°</th>
                    <th style="border: 1px solid black; padding: 8px; text-align: center;">DESCRIPCIÓN</th>
                    <th style="border: 1px solid black; padding: 8px; text-align: center; width: 120px;">CANTIDAD</th>
                    <th style="border: 1px solid black; padding: 8px; text-align: center; width: 100px;">TOTAL</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: 1px solid black; padding: 15px; text-align: center;">1</td>
                    <td style="border: 1px solid black; padding: 15px; text-transform: uppercase;">{{PRODUCT_NAME}}</td>
                    <td style="border: 1px solid black; padding: 15px; text-align: center;">{{QUANTITY}}</td>
                     <td style="border: 1px solid black; padding: 15px; text-align: center;">{{QUANTITY_VAL}}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- FOOTER ROUTE -->
    <div style="margin-bottom: 60px; font-size: 12px; text-align: justify; font-weight: bold; text-transform: uppercase;">
        RUTA DE VUELTA: PLANTA DE CEMENTO SAN SEBASTIAN AV. INTERCOMUNAL LOCAL LOTE "E", PARCELA NRO 35 ,SECTOR EL BOSQUE LOS RURALES DE PAYA, TURMERO ROSARIO DE PAYA, EDO. ARAGUA
    </div>

    <!-- SIGNATURE -->
    <div style="text-align: center; width: 250px; margin: 0 auto;">
         <div style="border-bottom: 1px solid black; height: 1px; margin-bottom: 10px;"></div>
         <p style="font-weight: bold; font-size: 14px; margin: 0;">ARQ. {{ISSUER_NAME}}</p>
         <p style="font-weight: bold; font-size: 12px; margin: 0;">{{ISSUER_ROLE}}</p>
         <p style="font-size: 12px; margin: 5px 0 0 0;">Telf. contacto: {{CONTACT_PHONE}}</p>
    </div>
</div>
`;
