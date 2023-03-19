import { useEffect, useState } from 'react'
import axios from 'axios'
import HeaderQA from '../header/HeaderQA';
import SidebarQA from '../sidebar/SidebarQA';

//import từ bên trong src
import style from './Category.module.css'
import { apiUrl } from '../../../constants/constants'

const Category = () => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [addCategoryForm, setAddCategoryForm] = useState({
    Title: '',
    Description: '',
    DateInnitiated: new Date().toISOString(),
    Status: ''
  })
  const [editingCategory, setEditingCategory] = useState({
    _id: '',
    editingTitle: '',
    editingDescription: '',
    editingDateInnitiated: null,
    editingStatus: ''
  })

  const { Title, Description, DateInnitiated, Status } = addCategoryForm;
  const { _id, editingTitle, editingDescription, editingDateInnitiated, editingStatus } = editingCategory

  useEffect(() => {
    try {
      (async () => {
        const response = await axios.get(`${apiUrl}/category/showAll`)
        if (response.data.success) {
          console.log(response.data.categories)
          setCategories(response.data.categories)
          setSelectedCategory(response.data.categories[0])
          setEditingCategory(response.data.categories[0])
        }
      })();
    } catch (error) {
      console.error(error.response.data.message)
    };
  }, [])

  const onChangeAddCategoryForm = event => setAddCategoryForm({ ...addCategoryForm, [event.target.name]: event.target.value })

  const onChangeEditCategoryForm = event => setEditingCategory({ ...editingCategory, [event.target.name]: event.target.value })

  const addCategory = () => {
    setShowAddModal(false);
    (async () => {
      try {
        const response = await axios.post(`${apiUrl}/category/addCategory`, addCategoryForm)
        if (response.data.success) {
          console.log(response.data)
          const date = new Date(response.data.category.DateInnitiated)
          response.data.category.DateInnitiated = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
          setCategories([...categories, response.data.category])
          setAddCategoryForm({
            Title: '',
            Description: '',
            Status: ''
          })
        }
      } catch (error) {
        console.log(error.response.data)
      }
    }
    )()
  }

  const getEditingCategory = () => {
    setShowEditModal(true)
    console.log(selectedCategory)
    setEditingCategory({
      _id: selectedCategory._id,
      editingTitle: selectedCategory.Title,
      editingDescription: selectedCategory.Description,
      editingDateInnitiated: selectedCategory.DateInnitiated,
      editingStatus: selectedCategory.Status
    })
  }

  const editCategory = () => {
    setShowEditModal(false);
    (async () => {
      try {
        const response = await axios.put(`${apiUrl}/category/updateCategory/${editingCategory._id}`, { _id: _id, Title: editingTitle, Description: editingDescription, DateInnitiated: editingDateInnitiated, Status: editingStatus })
        if (response.data.success) {
          console.log(response.data)
          setSelectedCategory(response.data.category)
          const newCategories = categories.map(category => {
            if (category._id === response.data.category._id) {
              return response.data.category
            }
            return category
          })
          setCategories(newCategories)
        }
      } catch (error) {
        console.error(error.response.data)
      }
    })()
  }

  const deleteCategory = event => {
    event.preventDefault();
    (async () => {
      try {
        const response = await axios.delete(`${apiUrl}/category/deleteCategory/${selectedCategory._id}`)
        if (response.data.success) {
          const filteredCategories = categories.filter(category => category._id !== selectedCategory._id)
          setCategories(filteredCategories)
          setSelectedCategory(filteredCategories[0])
        }
      } catch (error) {
        console.error(error.response.data)
      }
    })()
  }


  return (
    <div className={style.categoryWrapper}>
      <SidebarQA/>
      {/* ben duoi */}
      <div className={style.cateContainer}>
        <HeaderQA/>
        <div className={style.tbCategory}>          
            {selectedCategory && (        
              <table className="table table-hover">
                <thead>
                <br/> <br/> <br/> <br/>
                </thead>
                <tbody>               
                  <tr >
                    <th className={style.tiletb}>TITLE</th>
                    <td>{selectedCategory.Title}</td>
                  </tr>
                  <tr>
                    <th className={style.tiletb}>DESCRIPTION</th>
                    <td>{selectedCategory.Description}</td>
                  </tr>
                  <tr>
                    <th className={style.tiletb}>INITIATED DATE</th>
                    <td>{selectedCategory.DateInnitiated}</td>
                  </tr>
                  <tr>
                    <th className={style.tiletb}>STATUS</th>
                    <td>{selectedCategory.Status}</td>    
                  </tr>
                </tbody>
              </table>
            )}
        </div>

        <div className={style.infomationWrapper}>
          <div className={style.information}>
              <div className={style.categoryName}>Category</div>
              <div className={style.iconEdit}><i className="fa fa-pencil" aria-hidden="true" onClick={getEditingCategory}></i></div>
              <div className={style.iconDelete}><i className="fa fa-trash-o" aria-hidden="true" onClick={deleteCategory}></i></div> 
              <div className={style.iconAdd}><i className="fa fa-plus" aria-hidden="true" onClick={() => setShowAddModal(true)}></i></div>
          </div> 
        </div>


        <div className={style.otherCategoriesWrapper}>
          <div className={style.labelList}>List of categories</div>
      
          <ul>
            {
              Array.isArray(categories) ? categories.map((category, index) => {
                const date = new Date(category.DateInnitiated);
                category.DateInnitiated = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
                return <li key={index} onClick={() => setSelectedCategory(category)}>{category.Title}</li>
              }) : <h1>Error</h1>
            }
          </ul>
        </div>


      </div>

      {showAddModal && (
        <div className={style.categoryModal}>
          <div className={style.categoryModalContent}>
            <span className={style.categoryClose} onClick={() => setShowAddModal(false)}>
              &times;
            </span>
            <h1 className={style.cateTitle}>Add Category</h1>
            <form className={style.formAdd} onSubmit={addCategory}>
              <div className={style.inputCate}>
                  <input className={style.ipTitle} type='text' name='Title' placeholder='Title' required value={Title} onChange={onChangeAddCategoryForm} />
              </div >
              <div >
                  <input type='hidden' name='DateInnitiated' value={DateInnitiated} />
              </div>
              <div className={style.inputCate}>
              {/* <select
                className={style.ipStatus} name='Status'
                required value={Status} onChange={onChangeAddCategoryForm}
                          >
                            <option value="Opening">Opening</option>
                            <option value="Closed">Closed</option>
                          </select> */}
              <input className={style.ipStatus} type='text' name='Status' placeholder='Status' required value={Status} onChange={onChangeAddCategoryForm} />
              </div>
              <div className={style.inputCate}>
                  <textarea rows={5} className={style.ipDes} type='text' name='Description' placeholder='Description' required value={Description} onChange={onChangeAddCategoryForm} />
              </div> 
              <input className={style.btnAddCate} type='submit' value='Add' />
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className={style.categoryModal}>
          <div className={style.categoryModalContent}>
            <span className={style.categoryClose} onClick={() => setShowEditModal(false)}>
              &times;
            </span>
            <h1 className={style.cateTitle} >Update Category</h1>
            <form className={style.formAdd} onSubmit={editCategory}>
              <input type='hidden' name='_id' value={_id} />

              <div className={style.inputCate}>
                  <input className={style.ipTitle} type='text' name='editingTitle' placeholder='Title' required value={editingTitle} onChange={onChangeEditCategoryForm} />
              </div >
              <div >
                  <input type='hidden' name='editingDateInnitiated' value={editingDateInnitiated} />
              </div>
              <div className={style.inputCate}>    
              <select
                className={style.ipStatus} name='editingStatus'
                required value={editingStatus} onChange={onChangeEditCategoryForm}
                          >
                            <option value="Opening">Opening</option>
                            <option value="Closed">Closed</option>
                          </select>            
                  {/* <input  className={style.ipStatus} type='text' name='editingStatus' placeholder='Status' required value={editingStatus} onChange={onChangeEditCategoryForm} /> */}
              </div>
              <div className={style.inputCate}>                 
                  <textarea rows={5} className={style.ipDes}  type='text' name='editingDescription' placeholder='Description' required value={editingDescription} onChange={onChangeEditCategoryForm} />
              </div> 
              <input className={style.btnAddCate} type='submit' value='Save' />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Category;