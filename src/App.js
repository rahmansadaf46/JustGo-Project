import { useEffect, useState } from 'react';
import './App.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faSearch, faUser } from '@fortawesome/free-solid-svg-icons'
import loadingPic from './image/loading.gif';

function App() {
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState('1');
  // const [searchData, setSearchData] = useState([]);
  const [filterUser, setFilterUser] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [user, setUser] = useState([]);
  const [button, setButton] = useState(false);
  const [query, setQuery] = useState('');
  const [gender, setGender] = useState('all');
  const btn = () => {
    setButton(!button)
  }


  useEffect(() => {
    fetch('https://randomuser.me/api/?results=50')
      .then(res => res.json())
      .then(data => {
        const result = data.results;
        let filterResult = [];
        result.forEach((data) => {
          filterResult.push({
            picture: data.picture.large,
            firstName: data.name.first,
            lastName: data.name.last,
            email: data.email,
            userName: data.login.username,
            registered: data.registered.date,
            gender: data.gender
          })
        })
        setFilterUser(filterResult);
        setAllUser(filterResult);
        setUser(filterResult);
        setLoading(false)
      })
  }, [])

  const dateConverter = (data) => {
    var dateObj = new Date(data);
    var month = dateObj.getUTCMonth() + 1;
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    return day + "-" + month + "-" + year;

  }

  const pagination = (number) => {
    window.scroll(0, 0);
    setPage(number);
    setUser(filterUser.slice(number * 10 - 10, number * 10));
  }

  const search = (rows) => {
    if (rows) {
      const columns = rows[0] && Object?.keys(rows[0]).filter(data => data !== "registered" && data !== "picture" && data !== "gender");
      return rows?.filter((row) =>
        columns?.some(
          (column) =>
            row[column]
              ?.toString()
              .toLowerCase()
              .indexOf(query?.toLowerCase()) > -1
        )
      )
    }
  }
  const genderFilter = (gender) => {
    setGender(gender)
    setPage('1');
    if (gender === 'all') {
      setUser(allUser);
      setFilterUser(allUser)
    }
    else {
      let filterData = allUser.filter(user => user.gender === gender);
      setFilterUser(filterData);
      setUser(filterData);
    }
  }
  return (
    <div className="mx-5">
      <div className='mt-4'>
        <h2>User List</h2>
        <div className="row nav-body">
          <div className='col-lg-4 col-md-12 filter'>
            <div>
              <div >
                <FontAwesomeIcon icon={faSearch} className='search-icon' />
              </div>
              <input value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }} type="text" className='search-box' placeholder='Search...' />
            </div>

          </div>
          <div className='col-lg-5 col-md-12 filter'>
            <div className='mt-4'>
              <label htmlFor="ritema"><b>Filter by:</b></label> &nbsp;&nbsp;
              <div className="radio-item">
                <input onClick={() => genderFilter('all')} defaultChecked={gender === 'all'} type="radio" id="ritema" name="ritem" value="ropt1" />
                <label onClick={() => genderFilter('all')} htmlFor="ritema">All</label>
              </div>

              <div className="radio-item">
                <input onClick={() => genderFilter('male')} type="radio" id="ritemb" name="ritem" value="ropt2" />
                <label onClick={() => genderFilter('male')} htmlFor="ritemb">Male</label>
              </div>

              <div className="radio-item">
                <input onClick={() => genderFilter('female')} type="radio" id="ritemc" name="ritem" value="ropt3" />
                <label onClick={() => genderFilter('female')} htmlFor="ritemc">Female</label>
              </div>
            </div>
          </div>
          <div className='col-lg-3 d-flex justify-content-end col-md-12 tile-body'>
            <label className='mt-2'><b>Tile View</b></label> &nbsp; &nbsp; &nbsp;
            <div >
              <div className="checkbox-btn">
                <input onClick={btn} type="checkbox" className="checkbox" />
                <div className={!button ? 'toggler btn-bg-green' : 'toggler btn-bg'} ></div>
                <p className='tick'><b>✔</b></p>
              </div>
            </div>
          </div>
        </div>

        {loading &&
          <div className='d-flex justify-content-center'>
            <img src={loadingPic} alt="loading..." />
          </div>
        }

        {button ? <div className='mt-5 mb-5 table-box'>
          <table >
            <thead >
              <tr >
                <th className='p-4'>Name</th>
                <th className='p-4'>Registration Date</th>
                <th className='p-4'>Username</th>
              </tr>
            </thead>
            <tbody>
              {search(user).slice(0, 10)?.map((data, index) =>
                <tr key={index} >
                  <td className='p-4'>
                    <div className='d-flex'>
                      <div >
                        <img className="avatar image" src={data?.picture} alt="img" />
                      </div>
                      <div className='ms-3'>
                        <span><b>{data.lastName},{data.firstName}</b></span><br />
                        <span className='text-gray'><b>{data.email}</b></span>
                      </div>
                    </div></td>
                  <td className='p-4'>{dateConverter(data.registered)}</td>
                  <td className='p-4 text-gray'>{data.userName}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div> : <div className='mt-5 mb-5'>
          <div className='row d-flex justify-content-center'>
            {
              user.length > 0 && <>
                {search(user).slice(0, 10)?.map((data, index) => <div key={index} className='col-lg-4 col-md-6 my-2'>
                  <div className='card-box'>
                    <div className='row p-1 pt-3'>
                      <div className='col-2'>
                        <img className="avatar image" src={data?.picture} alt="img" />
                      </div>
                      <div className='col-10 '>
                        <span className='card-box-name'><b>{data.lastName},{data.firstName}</b></span> <br />
                        <span className='text-gray'><b>{data.email}</b></span><br />
                        <div className='card-box-info'>
                          <span ><FontAwesomeIcon icon={faUser} /><span className='ms-2'><b>{data.userName}</b></span></span><br />
                          <span ><FontAwesomeIcon icon={faCalendar} /><span className='ms-2'><b>{dateConverter(data.registered)}</b></span></span><br />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>)}
              </>
            }

          </div>
        </div>}



        {
          !loading && <div className='mb-5 pagination-section'>
            <div className="pagination">
              <span onClick={() => pagination('1')} >&laquo;</span>&nbsp;&nbsp;&nbsp;
              <span onClick={() => pagination('1')} className={page === '1' ? 'active' : ''}>1</span>&nbsp;&nbsp;&nbsp;
              <span onClick={() => pagination('2')} className={page === '2' ? 'active' : ''} >2</span>&nbsp;&nbsp;&nbsp;
              <span onClick={() => pagination('3')} className={page === '3' ? 'active' : ''}>3</span>&nbsp;&nbsp;&nbsp;
              <span onClick={() => pagination('4')} className={page === '4' ? 'active' : ''}>4</span>&nbsp;&nbsp;&nbsp;
              <span onClick={() => pagination('5')} className={page === '5' ? 'active' : ''}>5</span>&nbsp;&nbsp;&nbsp;
              <span onClick={() => pagination('5')} >&raquo;</span>&nbsp;&nbsp;&nbsp;
            </div>
          </div>}


      </div>



    </div>
  );
}

export default App;
