import { useState, useEffect } from "react";
import incomeExpensesService from "../../services/incomeExpensesService";
import { Table } from "antd";
import { formatterPrice } from "../../utils/formatterPrice";

const Home = () => {

    const columnsIncome = [
        {
            title: <label className="text-center text-lg ">รายรับ</label>,
            align: 'center',
            children: [
                {
                    title: 'รายการ',
                    dataIndex: 'name',
                    width: '50%',
                    key: 'name',
                    align: 'center',
                    onCell: (record, rowIndex) => ({
                        style: {
                            backgroundColor: record.name === 'ค้างชำระ' ? '#fff4dd' : record.name === "ยอดขายรวม" ? '#f6ffed' : 'transparent',
                        },
                    }),
                    render: (text, record) => {
                        if (record.name === 'ค้างชำระ') {
                            return <div className="flex justify-end items-center pr-4" > <span style={{ color: 'orange' }}>{record.name}</span> </div>
                        } else if (record.name === 'ยอดขายรวม') {
                            return <div className="flex justify-end items-center pr-4" > <span style={{ color: 'green' }}>{record.name}</span> </div>
                        }
                        else {
                            return <div className="flex justify-end items-center pr-4" > <span>{record.name}</span></div>
                        }
                    }
                },
                {
                    title: 'จำนวนเงิน',
                    dataIndex: 'amount',
                    width: '50%',
                    key: 'amount',
                    align: 'center',
                    onCell: (record, rowIndex) => ({
                        style: {
                            backgroundColor: record.name === 'ค้างชำระ' ? '#fff4dd' : record.name === "ยอดขายรวม" ? '#f6ffed' : 'transparent',
                        },
                    }),
                    render: (text, record) => {
                        if (record.name === 'ค้างชำระ') {
                            return <div className="flex justify-end items-center pr-4" > <span style={{ color: 'orange' }}>{record.amount}</span> </div>
                        } else if (record.name === 'ยอดขายรวม') {
                            return <div className="flex justify-end items-center pr-4" > <span style={{ color: 'green' }}>{formatterPrice(record.amount)}</span> </div>
                        } else {
                            return <div className="flex justify-end items-center pr-4" > <span>{formatterPrice(record.amount)}</span></div>
                        }
                    }
                },

            ],
        },
    ];

    const columnsExpenses = [
        {
            title: <label className="text-center text-lg ">รายจ่าย</label>,
            align: 'center',
            children: [
                {
                    title: 'รายการ',
                    dataIndex: 'name',
                    width: '50%',
                    key: 'name',
                    align: 'center',
                    onCell: (record, rowIndex) => ({
                        style: {
                            backgroundColor: record.name === 'รายจ่ายสุทธิ' ? '#fff1f0' : 'transparent',
                        },
                    }),
                    render: (text, record) => {
                        if (record.name === 'รายจ่ายสุทธิ') {
                            return <div className="flex justify-end items-center pr-4" > <span style={{ color: 'red' }}>{record.name}</span></div>
                        } else {
                            return <div className="flex justify-end items-center pr-4" > <span>{record.name}</span></div>
                        }
                    }
                },
                {
                    title: 'จำนวนเงิน',
                    dataIndex: 'amount',
                    width: '50%',
                    key: 'amount',
                    align: 'center',
                    onCell: (record, rowIndex) => ({
                        style: {
                            backgroundColor: record.name === 'รายจ่ายสุทธิ' ? '#fff1f0' : 'transparent',
                        },
                    }),
                    render: (text, record) => {
                        if (record.name === 'รายจ่ายสุทธิ') {
                            return <div className="flex justify-end items-center pr-4" > <span style={{ color: 'red' }}>{formatterPrice(record.amount)}</span></div>
                        } else {
                            return <div className="flex justify-end items-center pr-4" > <span>{formatterPrice(record.amount)}</span></div>
                        }
                    }
                }
            ],
        },
    ]

    const columnsTotal = [
        {
            title: <label className="text-center text-lg ">รายการสรุป</label>,
            align: 'center',
            children: [
                {
                    title: 'รายการ',
                    dataIndex: 'name',
                    width: '50%',
                    key: 'name',
                    align: 'center',
                    onCell: (record, rowIndex) => ({
                        style: {
                            backgroundColor: record.name === 'หักรายจ่ายสุทธิ' ? '#fff4dd' : record.name === "รวมยอดรายรับเงินสดสุทธิ" ? (record.amount < 0 ? '#fff1f0' : '#f6ffed') : 'transparent',
                        },
                    }),
                    render: (text, record) => {
                        if (record.name === 'หักรายจ่ายสุทธิ') {
                            return <div className="flex justify-end items-center pr-4" > <span style={{ color: 'orange' }}>{record.name}</span> </div>
                        } else if (record.name === 'รวมยอดรายรับเงินสดสุทธิ') {
                            if (record.amount < 0) {
                                return <div className="flex justify-end items-center pr-4" > <span style={{ color: 'red' }}>{record.name}</span> </div>
                            }
                            return <div className="flex justify-end items-center pr-4" > <span style={{ color: 'green' }}>{record.name}</span> </div>
                        }
                        else {
                            return <div className="flex justify-end items-center pr-4" > <span>{record.name}</span></div>
                        }
                    }
                },
                {
                    title: 'จำนวนเงิน',
                    dataIndex: 'amount',
                    width: '50%',
                    key: 'amount',
                    align: 'center',
                    onCell: (record, rowIndex) => ({
                        style: {
                            backgroundColor: record.name === 'หักรายจ่ายสุทธิ' ? '#fff4dd' : record.name === "รวมยอดรายรับเงินสดสุทธิ" ? (record.amount < 0 ? '#fff1f0' : '#f6ffed') : 'transparent',
                        },
                    }),
                    render: (text, record) => {
                        if (record.name === 'หักรายจ่ายสุทธิ') {
                            return <div className="flex justify-end items-center pr-4" > <span style={{ color: 'orange' }}>{formatterPrice(record.amount)}</span> </div>
                        } else if (record.name === 'รวมยอดรายรับเงินสดสุทธิ') {
                            if (record.amount < 0) {
                                return <div className="flex justify-end items-center pr-4" > <span style={{ color: 'red' }}>{formatterPrice(record.amount)}</span> </div>
                            } else
                                return <div className="flex justify-end items-center pr-4" > <span style={{ color: 'green' }}>{formatterPrice(record.amount)}</span> </div>
                        } else {
                            return <div className="flex justify-end items-center pr-4" > <span>{formatterPrice(record.amount)}</span></div>
                        }
                    }
                },

            ],
        },
    ];

    const [income, setIncome] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [totalBalance, setTotalBalance] = useState([]);


    const getIncomeExpenses = async () => {
        let income = [];
        let expenses = [];
        let totalIncome = 0;
        let totalExpense = 0;
        let totalBalance = [];

        const responseIncome = await incomeExpensesService.calculateIncome();
        const responseExpenses = await incomeExpensesService.calculateExpenses();
        responseIncome.map((item, index) => {
            income.push({ key: index, name: 'ยอดชำระจากบิลค้างชำระ', amount: item.total_deposit });
            income.push({ key: index, name: 'มัดจำ', amount: item.total_net_balance });
            income.push({ key: index, name: 'ค้างชำระ', amount: (item.total_income - item.total_deposit) });
            income.push({
                key: index, name: 'ยอดขายรวม', amount:
                    parseInt(item.total_income) - parseInt(item.total_deposit) + parseInt(item.total_net_balance)
            });
            totalIncome = parseInt(item.total_income) - parseInt(item.total_deposit) + parseInt(item.total_net_balance);
        });

        responseExpenses.map((item, index) => {
            expenses.push({ key: index, name: item.expense_type_name, amount: item.total_expense });
            totalExpense += parseFloat(item.total_expense);
        });
        expenses.push({ key: responseExpenses.length, name: 'รายจ่ายสุทธิ', amount: totalExpense });

        totalBalance.push({ key: 0, name: 'รายรับสุทธิ', amount: totalIncome })
        totalBalance.push({ key: 1, name: 'หักรายจ่ายสุทธิ', amount: totalExpense })
        totalBalance.push({ key: 2, name: 'รวมยอดรายรับเงินสดสุทธิ', amount: totalIncome - totalExpense })

        setIncome(income);
        setExpenses(expenses);
        setTotalBalance(totalBalance);

    }


    useEffect(() => {
        getIncomeExpenses();
    }, []);

    return (
        <>
            <div className="title-page">
                <h3 className="text-[#444444]">ภาพรวมรายรับ-รายจ่าย</h3>
            </div>
            <div className="padding-content">
                <div className="grid grid-cols-2 gap-4 content-list">
                    <div className=" col-span-1 ">
                        {/* 
                            สร้างตารางแสดงรายรับ-รายจ่าย โดยใช้ incomeExpenses และ expenses ที่ได้จากการเรียกใช้งาน incomeExpensesService โดยใช้ useEffect
                            โดยตารางจะแสดงข้อมูลดังนี้ รายการ, รายรับ, รายจ่าย, คงเหลือ โดยใช้ข้อมูลจาก incomeExpenses และ expenses
                        */}
                        <Table columns={columnsIncome} dataSource={income} bordered pagination={false} />
                    </div>
                    <div className="col-span-1 ">
                        <Table columns={columnsExpenses} dataSource={expenses} bordered pagination={false} />
                    </div>
                    {/* table total balance */}
                    <div className="col-span-2 ">
                        <Table columns={columnsTotal} dataSource={totalBalance} bordered pagination={false} />
                    </div>
                </div>

            </div>
        </>
    );
};

export default Home;