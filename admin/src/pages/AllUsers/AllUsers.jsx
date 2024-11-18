import React ,{ useEffect,useMemo ,useState} from 'react';
import TableContainer from "../../utils/TableContainer";
import Layout from '../Layout/Layout';
import axios from 'axios';
import {useParams} from 'react-router-dom';



const AllUsers = () => {
    const param =useParams()

    const [users,setUsers] = useState([]);
    const [count,setCount]=useState(0)

    useEffect(() => {
        (async ()=>{
            try {
                const response =await axios.get(`http://localhost:3001/users/${param.role}`)
                let allUsers = response.data.map(item=>{
                    return {
                        ...item,
                        courses: item.courses?.length,
                        completedCourses: item?.completedCourses?.length,
                        dateCreated: new Date(item?.dateCreated).toLocaleDateString()
                    }
                })
                console.log(allUsers);
                
                setUsers(allUsers)
            } catch (error) {
                console.log(error.message)
            }
        })()
    }, [count ,location.pathname]);
    const columns = useMemo(
        () => param.role === 'customer' ? [
            {
                header: 'Image',
                accessorKey: 'photoUrl',
                enableColumnFilter: false,
                enableSorting: true,
            },
            {
                header: 'Username',
                accessorKey: 'username',
                enableColumnFilter: false,
                enableSorting: true,
            },
            {
                header: 'Email',
                accessorKey: 'email',
                enableColumnFilter: false,
                enableSorting: true,
            },
            {
                header: 'Address',
                accessorKey: 'address',
                enableColumnFilter: false,
                enableSorting: true,
            },
            {
                header: 'Phone Number',
                accessorKey: 'phoneNumber',
                enableColumnFilter: false,
                enableSorting: true,
            },
            {
                header: 'Created Date',
                accessorKey: 'dateCreated',
                enableColumnFilter: false,
                enableSorting: true,
            },
            {
                header: 'Ban',
                accessorKey: 'isBanned',
                enableColumnFilter: false,
                enableSorting: true,
            }
            
        ] : [
            {
                header: 'Image',
                accessorKey: 'photoUrl',
                enableColumnFilter: false,
                enableSorting: true,
            },
            {
                header: 'Username',
                accessorKey: 'username',
                enableColumnFilter: false,
                enableSorting: true,
            },
            {
                header: 'Email',
                accessorKey: 'email',
                enableColumnFilter: false,
                enableSorting: true,
            },
            {
                header: 'city',
                accessorKey: 'city',
                enableColumnFilter: false,
                enableSorting: true,
            },
            {
                header: 'CIN',
                accessorKey: 'identityCard',
                enableColumnFilter: false,
                enableSorting: true,
            },
            {
                header: 'Certification',
                accessorKey: 'certification',
                enableColumnFilter: false,
                enableSorting: true,
            },
            {
                header: 'Phone Number',
                accessorKey: 'phoneNumber',
                enableColumnFilter: false,
                enableSorting: true,
            },
            {
                header: 'Created Date',
                accessorKey: 'dateCreated',
                enableColumnFilter: false,
                enableSorting: true,
            },
            {
                header: 'Validity',
                accessorKey: 'isAvailable',
                enableColumnFilter: false,
                enableSorting: true,
            },
            {
                header: 'Rating',
                accessorKey: 'rating',
                enableColumnFilter: false,
                enableSorting: true,
            },
            {
                header: 'Ban',
                accessorKey: 'isBanned',
                enableColumnFilter: false,
                enableSorting: true,
            }
        ],
        []
    );

    return (
        <Layout>
            <React.Fragment>
            <div className="card w-full flex  justify-center p-10">
                <div className="card-body w-auto p-4  shadow-lg border border-gray-200">
                    <h6 className="mb-4 text-15 uppercase">{param.role}s data</h6>
                    <TableContainer
                        type = 'users'
                        setCount={setCount}
                        isPagination={true}
                        isTfoot={true}
                        isSelect={true}
                        isGlobalFilter={true}
                        columns={columns || []}
                        userType={param.role}
                        data={users || []}
                        customPageSize={10}
                        divclassName="my-2 col-span-12 overflow-x-auto lg:col-span-12"
                        tableclassName="display max-w-[1048] stripe group dataTable  text-sm align-middle whitespace-nowrap"
                        theadclassName="border-b border-slate-200 dark:border-zink-500"
                        thclassName="ltr:!text-left rtl:!text-right p-3 group-[.bordered]:border group-[.bordered]:border-slate-200 group-[.bordered]:dark:border-zink-500 sorting px-3 py-4 text-slate-900 bg-slate-200/50 font-semibold text-left dark:text-zink-50 dark:bg-zink-600 dark:group-[.bordered]:border-zink-500 sorting_asc"
                        tdclassName="p-3 group-[.bordered]:border group-[.bordered]:border-slate-200 group-[.bordered]:dark:border-zink-500"
                        PaginationClassName="flex flex-col items-center mt-5 md:flex-row"
                    />
                </div>
            </div>
        </React.Fragment>
        </Layout>
    );
}

export default AllUsers;
