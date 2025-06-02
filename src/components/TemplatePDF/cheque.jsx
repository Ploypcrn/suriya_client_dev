import React, { useEffect, useState } from 'react';
import ReactToPrint from 'react-to-print';
import {
    Button,
    Table
} from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { bahttext } from "bahttext"
import { formatterPrice } from "../../utils/formatterPrice";
import PropType from 'prop-types';

const ChequePDF = React.forwardRef(() => {
    const componentRef = React.useRef();
    const StorageData = JSON.parse(localStorage.getItem("dataCheque"));

    return (
        <>
            <div className="flex justify-center text-black">
                <div className='p-5'>
                    <div className="flex justify-end p-5 bg-white w-[27cm]">
                        <ReactToPrint
                            trigger={() =>
                                <Button
                                    type="primary"
                                    icon={<PrinterOutlined />}
                                >
                                    พิมพ์
                                </Button>
                            }
                            content={() => componentRef.current}
                        />
                    </div>
                    <div ref={componentRef} className="p-5 bg-white page-cheque">
                        <div className="grid grid-cols-2 items-center" >
                            <div className='col-span-1 col-cheque-row1-left'>
                                {StorageData.payeeOnly ? "A/C PAYEE ONLY" : ''}
                            </div>
                            <div className='col-span-1 col-cheque-row1-right'>
                                {StorageData.clearanceDate}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 items-center" >
                            <div className='col-span-1 col-cheque-row2'>
                                เงินสด
                            </div>
                        </div>

                        <div className="grid grid-cols-1 items-center" >
                            <div className='col-span-1 col-cheque-row2'>
                                {bahttext(StorageData.amount)}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 items-center" >
                            <div className='col-span-1 col-cheque-row3'>
                                {`=${formatterPrice(StorageData.amount)}=`}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
})

export default ChequePDF;