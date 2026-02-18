
// GUÍA DE TRASLADO: Matches Image 2 (CONSTRUFANB)
export const DEFAULT_TRANSFER_GUIDE_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.3; color: black;">

    <!-- HEADER -->
    <table style="width: 100%; border: none; margin-bottom: 20px;">
        <tr>
            <td style="width: 15%; vertical-align: top; border: none; padding: 0;">
                <!-- Placeholder for Logo -->
                 <div style="width: 80px; height: 80px; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #999;">
                    LOGO
                </div>
            </td>
            <td style="width: 85%; text-align: center; vertical-align: top; border: none; padding: 0;">
                <p style="margin: 0; font-weight: bold; font-size: 10pt;">REPUBLICA BOLIVARIANA DE VENEZUELA</p>
                <p style="margin: 0; font-weight: bold; font-size: 10pt;">MINISTERIO DEL PODER POPULAR PARA LA DEFENSA</p>
                <p style="margin: 0; font-weight: bold; font-size: 10pt;">VICEMINISTERIO DE LOS SERVICIOS PERSONAL Y LOGISTICA</p>
                <p style="margin: 0; font-weight: bold; font-size: 10pt;">DIRECCIÓN GENERAL DE EMPRESAS Y SERVICIOS</p>
                <p style="margin: 0; font-weight: bold; font-size: 10pt;">EMPRESA CONSTRUCTORA DE LA FUERZA ARMADA NACIONAL BOLIVARIANA C.A</p>
            </td>
        </tr>
    </table>

    <!-- DATE ALIGNED RIGHT -->
    <div style="text-align: right; margin-bottom: 20px; font-weight: bold;">
        FECHA: {{DATE}}
    </div>

    <!-- TITLE -->
    <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="text-decoration: underline; margin: 0; font-size: 14pt;">GUÍA DE TRASLADO</h2>
    </div>

    <!-- BODY TEXT -->
    <div style="text-align: justify; margin-bottom: 20px;">
        <p style="margin-bottom: 10px; text-align: center;">Quien suscribe, hace constar que él ciudadano</p>
        
        <p style="line-height: 1.6;">
            Nombre y Apellidos: <b>{{DRIVER_NAME}}</b> C.I. N° <b>{{DRIVER_ID}}</b> Este Autorizado
            para conducir el vehículo tipo: <b>{{TRUCK_MODEL}}</b> Marca: <b>{{TRUCK_BRAND}}</b> Placas o Serial:
            <b>{{TRUCK_PLATE}}</b> Vehículo Plataforma Tipo: <b>{{TRAILER_MODEL}}</b> Placa: <b>{{TRAILER_PLATE}}</b> Con la
            finalidad de Efectuar Comisión: <b>TRASLADO DE {{QUANTITY}} {{QUANTITY_UNIT}} DE {{PRODUCT_NAME}} PARA
            OBRAS DEL MINISTERIO DEL PODER POPULAR PARA LA DEFENSA.</b>
        </p>

        <p style="margin-top: 20px; font-weight: bold;">
            Desde el: {{DATE}}
        </p>
    </div>

    <!-- TABLE -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; text-align: center;">
        <thead>
            <tr style="background-color: #f0f0f0;">
                <th style="border: 1px solid black; padding: 8px;">N°</th>
                <th style="border: 1px solid black; padding: 8px;">DESCRIPCIÓN</th>
                <th style="border: 1px solid black; padding: 8px;">CANTIDAD:</th>
                <th style="border: 1px solid black; padding: 8px;">TOTAL</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="border: 1px solid black; padding: 10px;">1</td>
                <td style="border: 1px solid black; padding: 10px;">{{PRODUCT_NAME}}</td>
                <td style="border: 1px solid black; padding: 10px;">{{QUANTITY}} {{QUANTITY_UNIT}}</td>
                <td style="border: 1px solid black; padding: 10px;">{{QUANTITY}} {{QUANTITY_UNIT}}</td>
            </tr>
        </tbody>
    </table>

    <!-- ROUTE INFO -->
    <div style="text-align: center; margin-bottom: 60px; font-weight: bold; font-size: 10pt;">
        RUTA DE VUELTA: {{ORIGIN_ADDRESS}} HACIA {{DESTINATION_ADDRESS}}
    </div>

    <!-- SIGNATURE -->
    <div style="text-align: center;">
        <p style="margin: 0; font-weight: bold;">{{ISSUER_NAME}}</p>
        <p style="margin: 0; font-weight: bold;">{{ISSUER_ROLE}}</p>
        <p style="margin: 0;">Telf. contacto: {{CONTACT_PHONE}}</p>
    </div>

</div>
`;

// NOTA DE ENTREGA: Matches "GUIA DE DESPACHO" style (Green Header)
export const DEFAULT_DELIVERY_TEMPLATE = `
<table style="width: 100%; font-family: Arial, sans-serif; font-size: 12px; border-spacing: 0; margin-bottom: 20px;">
    <tr>
        <!-- Logo Left -->
        <td style="width: 15%; vertical-align: top; padding-bottom: 10px;">
             <div style="border: 1px solid #ccc; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; color: #666;">
                    LOGO<br>EMPRESA
            </div>
        </td>
        <!-- Title & Date Right -->
        <td style="width: 85%; vertical-align: top;">
            <div style="background-color: #79a356; color: white; padding: 8px; text-align: right; font-weight: bold; font-size: 16px; margin-bottom: 5px;">
                NOTA DE ENTREGA N° {{PLANT_ORDER_NO}}
            </div>
            <div style="text-align: right; font-weight: bold; font-size: 12px;">
                FECHA: {{DATE}}
            </div>
        </td>
    </tr>
</table>

<div style="background-color: #79a356; color: white; padding: 5px; font-weight: bold; font-size: 12px; margin-bottom: 0; border: 1px solid #79a356;">
    DATOS DEL CLIENTE
</div>
<table style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-family: Arial, sans-serif; font-size: 12px; margin-bottom: 20px;">
    <tr>
        <td style="border: 1px solid #ccc; padding: 5px; background-color: #f0f0f0; width: 120px; font-weight: bold;">Nombre Cliente:</td>
        <td style="border: 1px solid #ccc; padding: 5px;">{{CLIENT_NAME}}</td>
    </tr>
    <tr>
        <td style="border: 1px solid #ccc; padding: 5px; background-color: #f0f0f0; font-weight: bold;">Dirección:</td>
        <td style="border: 1px solid #ccc; padding: 5px;">{{DESTINATION_ADDRESS}}</td>
    </tr>
    <tr>
        <td style="border: 1px solid #ccc; padding: 5px; background-color: #f0f0f0; font-weight: bold;">RIF / Telf:</td>
        <td style="border: 1px solid #ccc; padding: 5px;">{{CLIENT_RIF}} / {{CLIENT_PHONE}}</td>
    </tr>
</table>

<table style="width: 100%; border-collapse: collapse; border: 1px solid black; font-family: Arial, sans-serif; font-size: 12px; text-align: center; margin-bottom: 20px;">
    <thead>
        <tr style="border-bottom: 2px solid black;">
            <th style="border: 1px solid black; padding: 8px;">PRODUCTO</th>
             <th style="border: 1px solid black; padding: 8px;">CANTIDAD</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="border: 1px solid black; padding: 15px;">{{PRODUCT_NAME}}</td>
            <td style="border: 1px solid black; padding: 15px;">{{QUANTITY}} {{QUANTITY_UNIT}}</td>
        </tr>
    </tbody>
</table>

<div style="background-color: #dbeafe; color: black; padding: 5px; font-weight: bold; font-size: 12px; margin-bottom: 0; border: 1px solid #93c5fd;">
    DATOS DEL CONDUCTOR
</div>
<table style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-family: Arial, sans-serif; font-size: 12px; margin-bottom: 20px;">
    <tr>
        <td style="border: 1px solid #ccc; padding: 5px; width: 50%;"><strong>Nombre:</strong> {{DRIVER_NAME}}</td>
        <td style="border: 1px solid #ccc; padding: 5px; width: 50%;"><strong>Cédula:</strong> {{DRIVER_ID}}</td>
    </tr>
    <tr>
        <td style="border: 1px solid #ccc; padding: 5px;"><strong>Vehículo:</strong> {{TRUCK_PLATE}}</td>
        <td style="border: 1px solid #ccc; padding: 5px;"><strong>Remolque:</strong> {{TRAILER_PLATE}}</td>
    </tr>
</table>

<!-- Signatures Side by Side -->
<table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 12px; margin-top: 40px;">
    <tr>
        <td style="width: 50%; padding: 20px; vertical-align: bottom;">
            <div style="border: 1px solid black; height: 80px; margin-bottom: 5px;"></div>
            <div style="text-align: center; font-weight: bold; background-color: #f0f0f0;">RECIBIDO POR</div>
            <div style="text-align: center; font-size: 10px; margin-top: 5px;">Nombre, Cédula y Firma</div>
        </td>
        <td style="width: 50%; padding: 20px; vertical-align: bottom;">
            <div style="text-align: right; margin-bottom: 60px;">
                <p style="font-weight: bold; font-size: 10px; color: #999;">SELLO DE LA EMPRESA</p>
            </div>
            <div style="border-top: 1px solid black; text-align: center; font-weight: bold;">
                {{ISSUER_NAME}}<br>
                <span style="font-size: 10px; font-weight: normal;">GERENTE DE COMERCIALIZACION</span>
            </div>
        </td>
    </tr>
</table>
`;

// AUTORIZACIÓN DE CARGA: MATCHES EXACTLY THE CSC IMAGE PROVIDED
export const DEFAULT_AUTHORIZATION_TEMPLATE = `
<div style="font-family: Arial, sans-serif; color: black; line-height: 1.3;">

    <!-- HEADER: CSC Logo & Date -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
            <td style="width: 60%; vertical-align: top;">
                <div style="display: flex; flex-direction: column;">
                     <!-- Placeholder for CSC Logo -->
                    <div style="width: 180px; height: 80px; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center; margin-bottom: 5px;">
                        <span style="font-size: 30px; font-weight: 900; color: #b91c1c;">CSC</span>
                    </div>
                    <div style="font-weight: bold; font-size: 14px; color: #b91c1c;">
                        Corporación<br>Socialista<br>del Cemento, S.A.
                    </div>
                    <div style="font-size: 8px;">RIF: G-20009048-0</div>
                </div>
            </td>
            <td style="width: 40%; vertical-align: top; text-align: right;">
                <p style="margin: 0; font-size: 12px;">Caracas, {{DATE}}</p>
            </td>
        </tr>
    </table>

    <!-- ATENCION -->
    <div style="margin-bottom: 20px; font-size: 12px;">
        <strong>Atención:</strong><br>
        Sres. Corporación Socialista del Cemento, C.A.
    </div>

    <!-- TITLE -->
    <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="font-size: 14px; font-weight: bold; text-decoration: underline; margin: 0; text-transform: uppercase;">AUTORIZACIÓN DE CARGA</h2>
    </div>

    <!-- BODY TEXT -->
    <div style="text-align: justify; font-size: 11px; margin-bottom: 15px;">
        <p style="margin: 0;">
            Quien suscribe <strong>{{ISSUER_NAME}}</strong> titular de la cedula de identidad N° <strong>{{ISSUER_ID}}</strong>, 
            en mi condición de <strong>{{ISSUER_ROLE}}</strong> de la empresa <strong>{{COMPANY_NAME}}</strong>, RIF: <strong>{{COMPANY_RIF}}</strong> 
            por medio de la presente autorizo al ciudadano <strong>{{DRIVER_NAME}}</strong>, titular de la cedula de identidad N° <strong>{{DRIVER_ID}}</strong> 
            a realizar el retiro del producto <strong>{{PRODUCT_NAME}}</strong> en la presentación de <strong>{{QUANTITY_UNIT}}</strong> por la planta 
            <strong>{{ORIGIN_ADDRESS}}</strong> anexan los datos del Vehículo, número(s) de pedido(s) y dirección destino.
        </p>
    </div>

    <!-- TABLE 1: PRODUCT INFO -->
    <div style="margin-bottom: 15px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; border: 1px solid black;">
            <thead style="background-color: #d1d5db;">
                <tr>
                    <th colspan="2" style="border: 1px solid black; padding: 4px; text-align: left; font-weight: bold; text-transform: uppercase;">SIRVA DESPACHAR POR NUESTRA CUENTA LO SIGUIENTE</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: 1px solid black; padding: 4px; width: 40%;">Código Cliente y Obra</td>
                    <td style="border: 1px solid black; padding: 4px;">{{CLIENT_CODE}}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid black; padding: 4px;">Código Destinatario</td>
                    <td style="border: 1px solid black; padding: 4px;">{{CONSIGNEE_CODE}}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid black; padding: 4px;">N° de oferta de venta</td>
                    <td style="border: 1px solid black; padding: 4px;">-</td>
                </tr>
                <tr>
                    <td style="border: 1px solid black; padding: 4px;">Descripción</td>
                    <td style="border: 1px solid black; padding: 4px;">{{PRODUCT_NAME}}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid black; padding: 4px;">Cantidad</td>
                    <td style="border: 1px solid black; padding: 4px;">{{QUANTITY}} {{QUANTITY_UNIT}}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid black; padding: 4px;">N° de pedido (s)</td>
                    <td style="border: 1px solid black; padding: 4px;">{{PLANT_ORDER_NO}}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- TABLE 2: ADDRESS INFO -->
    <div style="margin-bottom: 15px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; border: 1px solid black;">
            <thead style="background-color: #d1d5db;">
                <tr>
                     <th style="border: 1px solid black; padding: 4px; text-align: center; font-weight: bold;">DIRECCION EXACTA DE LA OBRA</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: 1px solid black; padding: 8px; text-align: center; font-weight: bold; height: 40px; vertical-align: middle;">
                        {{DESTINATION_ADDRESS}}
                    </td>
                </tr>
                <tr>
                    <td style="border: 1px solid black; padding: 0;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="border-right: 1px solid black; padding: 4px; width: 33%;">ESTADO: {{DESTINATION_STATE}}</td>
                                <td style="border-right: 1px solid black; padding: 4px; width: 33%;">MUNICIPIO: {{DESTINATION_MUNICIPALITY}}</td>
                                <td style="padding: 4px; width: 33%;">PARROQUIA: {{DESTINATION_PARISH}}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- TABLE 3: VEHICLES (Split Context) -->
    <div style="margin-bottom: 30px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
            <tr>
                <!-- CHUTO -->
                <td style="width: 48%; vertical-align: top; padding-right: 2%;">
                    <table style="width: 100%; border-collapse: collapse; border: 1px solid black;">
                        <thead style="background-color: #9ca3af;">
                            <tr>
                                <th colspan="2" style="border: 1px solid black; padding: 4px; font-weight: bold;">Datos del Vehículo (Chuto)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border: 1px solid black; padding: 4px;">Marca</td>
                                <td style="border: 1px solid black; padding: 4px;">{{TRUCK_BRAND}}</td>
                            </tr>
                            <tr>
                                <td style="border: 1px solid black; padding: 4px;">Placa</td>
                                <td style="border: 1px solid black; padding: 4px;">{{TRUCK_PLATE}}</td>
                            </tr>
                            <tr>
                                <td style="border: 1px solid black; padding: 4px;">Modelo</td>
                                <td style="border: 1px solid black; padding: 4px;">{{TRUCK_MODEL}}</td>
                            </tr>
                            <tr>
                                <td style="border: 1px solid black; padding: 4px;">Tipo</td>
                                <td style="border: 1px solid black; padding: 4px;">CHUTO</td>
                            </tr>
                            <tr>
                                <td style="border: 1px solid black; padding: 4px;">Color</td>
                                <td style="border: 1px solid black; padding: 4px;">{{TRUCK_COLOR}}</td>
                            </tr>
                        </tbody>
                    </table>
                </td>
                
                <!-- BATEA -->
                <td style="width: 48%; vertical-align: top; padding-left: 2%;">
                     <table style="width: 100%; border-collapse: collapse; border: 1px solid black;">
                        <thead style="background-color: #9ca3af;">
                            <tr>
                                <th colspan="2" style="border: 1px solid black; padding: 4px; font-weight: bold;">Datos del Vehículo (Plataforma/Cisterna)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border: 1px solid black; padding: 4px;">Marca</td>
                                <td style="border: 1px solid black; padding: 4px;">-</td>
                            </tr>
                            <tr>
                                <td style="border: 1px solid black; padding: 4px;">Placa</td>
                                <td style="border: 1px solid black; padding: 4px;">{{TRAILER_PLATE}}</td>
                            </tr>
                            <tr>
                                <td style="border: 1px solid black; padding: 4px;">Modelo</td>
                                <td style="border: 1px solid black; padding: 4px;">{{TRAILER_MODEL}}</td>
                            </tr>
                            <tr>
                                <td style="border: 1px solid black; padding: 4px;">Tipo</td>
                                <td style="border: 1px solid black; padding: 4px;">BATEA</td>
                            </tr>
                            <tr>
                                <td style="border: 1px solid black; padding: 4px;">Color</td>
                                <td style="border: 1px solid black; padding: 4px;">{{TRAILER_COLOR}}</td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </table>
    </div>

    <!-- FOOTER: SIGNATURE -->
    <div style="text-align: center; margin-bottom: 20px; font-size: 12px; font-weight: bold;">
        Atentamente,
    </div>

    <table style="width: 100%; font-size: 11px;">
        <tr>
            <td style="width: 60%; vertical-align: bottom;">
                <div style="border-top: 2px solid black; width: 80%; padding-top: 5px;">
                    <strong>{{ISSUER_NAME}}</strong><br>
                    <strong>{{ISSUER_ROLE}}</strong><br>
                    Teléfono de contacto: {{CONTACT_PHONE}}
                </div>
            </td>
            <td style="width: 40%; text-align: center;">
                 <div style="border: 1px solid #ccc; width: 120px; height: 80px; display: flex; align-items: center; justify-content: center; margin: 0 auto; color: #ccc; font-size: 10px;">
                    SELLO HUMEDO
                </div>
            </td>
        </tr>
    </table>

</div>
`;
