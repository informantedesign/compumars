"use client"

import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
}

// Variable Definitions for the Dropdown
const VARIABLES = [
    {
        title: 'Datos Cliente',
        items: [
            { text: 'Nombre Cliente', value: '{{CLIENT_NAME}}' },
            { text: 'RIF Cliente', value: '{{CLIENT_RIF}}' },
            { text: 'Código Cliente', value: '{{CLIENT_CODE}}' },
            { text: 'Código Destinatario', value: '{{CONSIGNEE_CODE}}' },
            { text: 'Teléfono Cliente', value: '{{CLIENT_PHONE}}' },
            { text: 'Dirección Destino (Detalle)', value: '{{DESTINATION_ADDRESS}}' },
            { text: 'Estado Destino', value: '{{DESTINATION_STATE}}' },
            { text: 'Municipio Destino', value: '{{DESTINATION_MUNICIPALITY}}' },
            { text: 'Parroquia Destino', value: '{{DESTINATION_PARISH}}' },
        ]
    },
    {
        title: 'Datos Carga',
        items: [
            { text: 'Producto', value: '{{PRODUCT_NAME}}' },
            { text: 'Cantidad', value: '{{QUANTITY}}' },
            { text: 'Unidad', value: '{{QUANTITY_UNIT}}' },
            { text: 'N° Pedido', value: '{{PLANT_ORDER_NO}}' },
        ]
    },
    {
        title: 'Flota y Chofer',
        items: [
            { text: 'Nombre Chofer', value: '{{DRIVER_NAME}}' },
            { text: 'Cédula Chofer', value: '{{DRIVER_ID}}' },
            { text: 'Placa Chuto', value: '{{TRUCK_PLATE}}' },
            { text: 'Marca Chuto', value: '{{TRUCK_BRAND}}' },
            { text: 'Placa Batea', value: '{{TRAILER_PLATE}}' },
        ]
    },
    {
        title: 'Sistema / Empresa',
        items: [
            { text: 'Fecha Actual', value: '{{DATE}}' },
            { text: 'Usuario Emisor', value: '{{ISSUER_NAME}}' },
            { text: 'Cargo Emisor', value: '{{ISSUER_ROLE}}' },
            { text: 'Nombre Empresa', value: '{{COMPANY_NAME}}' },
        ]
    }
];

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    const editorRef = useRef<any>(null);

    return (
        <div className="w-full h-full flex justify-center bg-[#e3e3e3] py-8 overflow-y-auto">
            <style jsx global>{`
                .tox-tinymce {
                    border: none !important;
                    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) !important;
                }
                /* Hide the promotion branding */
                .tox-promotion {
                    display: none !important;
                }
                .tox-statusbar__branding {
                    display: none !important;
                }
            `}</style>

            <div className="w-[21cm] min-h-[29.7cm]">
                <Editor
                    tinymceScriptSrc='/tinymce/tinymce.min.js'
                    licenseKey='gpl'
                    onInit={(evt, editor) => editorRef.current = editor}
                    value={content}
                    onEditorChange={(newValue, editor) => onChange(newValue)}
                    init={{
                        height: "29.7cm",
                        width: "21cm",
                        menubar: false,
                        promotion: false,
                        plugins: [
                            'image', 'table', 'lists', 'link', 'fullscreen', 'preview', 'pagebreak',
                            'advlist', 'autolink', 'charmap', 'anchor', 'searchreplace', 'visualblocks', 'code', 'insertdatetime', 'media', 'wordcount'
                        ],
                        toolbar: 'undo redo | blocks fontfamily fontsize | ' +
                            'bold italic underline forecolor | alignleft aligncenter ' +
                            'alignright alignjustify | table image | ' +
                            'bullist numlist outdent indent | ' +
                            'fullscreen preview | variables_sgl',

                        content_style: `
                            body { font-family:Helvetica,Arial,sans-serif; font-size:12pt; margin: 2cm; }
                            table { border-collapse: collapse; width: 100%; }
                            td, th { border: 1px solid black; padding: 5px; }
                        `, // Simulate A4 padding inside the iframe

                        // Image Configuration
                        image_title: true,
                        automatic_uploads: true,
                        file_picker_types: 'image',
                        file_picker_callback: (cb, value, meta) => {
                            const input = document.createElement('input');
                            input.setAttribute('type', 'file');
                            input.setAttribute('accept', 'image/*');
                            input.onchange = function () {
                                // @ts-ignore
                                const file = this.files[0];
                                const reader = new FileReader();
                                reader.onload = function () {
                                    const id = 'blobid' + (new Date()).getTime();
                                    const blobCache = (window as any).tinymce.activeEditor.editorUpload.blobCache;
                                    const base64 = (reader.result as string).split(',')[1];
                                    const blobInfo = blobCache.create(id, file, base64);
                                    blobCache.add(blobInfo);
                                    cb(blobInfo.blobUri(), { title: file.name });
                                };
                                reader.readAsDataURL(file);
                            };
                            input.click();
                        },

                        // Custom Menu Button setup
                        setup: (editor) => {
                            editor.ui.registry.addMenuButton('variables_sgl', {
                                text: 'Variables SGL',
                                icon: 'code-sample', // Icon from TinyMCE library
                                fetch: (callback) => {
                                    const items: any[] = [];

                                    VARIABLES.forEach(group => {
                                        items.push({
                                            type: 'nestedmenuitem',
                                            text: group.title,
                                            getSubmenuItems: () => {
                                                return group.items.map(item => ({
                                                    type: 'menuitem',
                                                    text: item.text,
                                                    onAction: () => {
                                                        editor.insertContent(`<span style="background-color: #e0f2fe; padding: 2px 5px; border-radius: 4px; border: 1px solid #bae6fd; font-weight: bold; color: #0284c7;" data-variable="${item.value}" contenteditable="false">${item.value}</span>&nbsp;`);
                                                    }
                                                }));
                                            }
                                        });
                                    });

                                    callback(items);
                                }
                            });
                        }
                    }}
                />
            </div>
        </div>
    );
}
