import React, { useEffect, useMemo, useState, useCallback } from "react";
import TableContainer from "../../utils/TableContainer";
import Layout from "../Layout/Layout";
import axios from "axios";
// import {useParams} from 'react-router-dom';
// import { ChevronDown, ChevronUp } from "lucide-react";
import { Modal } from "flowbite-react";
import Swal from "sweetalert2";
const Categories = () => {
  // const param =useParams()

  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [categoryId,setCategoryId]=useState(0)
  const [actionType , setActionType]=useState("create")
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [count, setCount] = useState(0);
  const toggle= (action , category)=>{
    console.log(category);
    
    if(action==="create"){
      setName("")
      setDescription("")
      setImage("")
    }else{
      setCategoryId(category.id)
      setName(category.name)
      setDescription(category.description)
      setImage(category.image)
    }
    setActionType(action)
    setOpenModal(true)
  }
  const handleCreateCategory = async ()=>{
    try {
      const response = await axios.post(
        `http://localhost:3001/users/admin/add-category`,
        {
          name,
          description,
          image,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      setOpenModal(false);
      setCount(count + 1);
      Swal.fire({
        icon: "success",
        title: "Category Added Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.log(error.message);
    }
  }
  const handleEditCategory = async ()=>{
    try {
      const response = await axios.put(
        `http://localhost:3001/users/admin/update-category/${categoryId}`,
        {
          name,
          description,
          image,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setOpenModal(false);
      setCount(count + 1);
      Swal.fire({
        icon: "success",
        title: "Category Updated Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.log(error.message);
    }
  }
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/stats/categories`
        );

        setCategories(response.data);
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, [count, location.pathname]);
  const columns = useMemo(() => [
    {
      header: "Image",
      accessorKey: "image",
      enableColumnFilter: false,
      enableSorting: true,
    },
    {
      header: "Category",
      accessorKey: "name",
      enableColumnFilter: false,
      enableSorting: true,
    },

    {
      header: "Description",
      accessorKey: "description",
      enableColumnFilter: false,
      enableSorting: true,
    },
    {
      header: "Number Of Services",
      accessorKey: "services.length",
      enableColumnFilter: false,
      enableSorting: true,
    },
  ]);

  return (
    <Layout className={openModal ? "filter grayscale" : ""}>
      <React.Fragment>
        <div className="flex justify-end items-center w-full">
          <button
            onClick={() => toggle('create')}
            className="bg-blue-600 hover:bg-blue-400 text-white py-2 px-4 rounded-md"
          >
            Add Category
          </button>
        </div>
        <div className="card w-full flex justify-center p-10">
          <div className="card-body w-[95%] p-4  shadow-lg border border-gray-200">
            <h6 className="mb-4 text-15 uppercase">Categories</h6>
            <TableContainer
              type="categories"
              setCount={setCount}
              isPagination={true}
              isTfoot={true}
              isSelect={true}
              isGlobalFilter={true}
              columns={columns || []}
              data={categories || []}
              customPageSize={10}
              toggle ={toggle}
              divclassName="my-2 col-span-12 overflow-x-auto lg:col-span-12"
              tableclassName="display stripe group dataTable w-full text-sm align-middle whitespace-nowrap"
              theadclassName="border-b border rounded-md dark:border-zink-500"
              thclassName="ltr:!text-left rtl:!text-right p-3 group-[.bordered]:border group-[.bordered]:border rounded-md group-[.bordered]:dark:border-zink-500 sorting px-3 py-4 text-slate-900 bg rounded-md/50 font-semibold text-left dark:text-zink-50 dark:bg-zink-600 dark:group-[.bordered]:border-zink-500 sorting_asc"
              tdclassName="p-3 group-[.bordered]:border group-[.bordered]:border rounded-md group-[.bordered]:dark:border-zink-500"
              PaginationClassName="flex flex-col items-center mt-5 md:flex-row" 

            />
          </div>
        </div>
        <Modal
          show={openModal}
          onClose={() => setOpenModal(false)}
          position="center"
          className="fixed my-12 lg:mx-96 p-7 inset-0 flex items-center justify-center z-50"
        >
          <Modal.Header className="p-5">{actionType == 'create' ? "Add Category" : "Edit Category"}</Modal.Header>
          <Modal.Body>
            <div className="space-y-6 p-3">
              <div className="mb-3">
              <label
                  htmlFor="image"
                  className="inline-block mb-2 text-base font-medium"
                >
                    imageUrl :<span className="text-red-500">*</span>
                </label> <br />
                <input
                  id="image"
                  name="image"
                  type="text"
                  value={image}
                  onChange={(e)=>setImage(e.target.value)}
                  className="form-input border rounded-md dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  required
                />
                
              </div>
              <div className="mb-3">
                <label
                  htmlFor="name"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Category Name :<span className="text-red-500">*</span>
                </label> <br />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  id="name"
                  className="form-input border rounded-md dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  required
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="description"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Category Description :<span className="text-red-500">*</span>
                </label> <br />
                <input
                  type="text"
                  value={description}
                  id="description"
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-input border rounded-md dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  required
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer c>
            <button
              className="bg-red-600 m-3 hover:bg-red-400 text-white py-2 px-4 rounded-md"
              color="gray"
              onClick={() => setOpenModal(false)}
            >
              Decline
            </button>
            <button
              onClick={actionType === 'create' ? handleCreateCategory : handleEditCategory}
              className="bg-blue-600 hover:bg-blue-400 text-white py-2 px-4 rounded-md"
            >
              Submit
            </button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    </Layout>
  );
};

export default Categories;
