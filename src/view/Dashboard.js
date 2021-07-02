import React from 'react'
const renderTable = ()=>(
    <table>
    <tr>
        <th>
            Name:
        </th>
        <th>
            Requirement's count:
        </th>    
        <th>
            Status:
        </th>
        <th>
            Check Requirements:
        </th>
        <th>
            
        </th>
    </tr>
    <tr>
        <td>
            GERALD
        </td>
        <td>
            6
        </td>
        <td>
            PENDING
        </td>
        <td>
            <button>VIEW</button>
        </td>
        <td>
            <select>
                <option>DISAPPROVED</option>
                <option>ASSOCIATES</option>
                <option>REGULAR</option>
            </select>
        </td>
    </tr>
    
</table>
)
export default function Dashboard() {
    return (
        <div>
            <h1>DASHBOARD:</h1>
            <div>
                <h4>NEW APPLICANTS:</h4>
                <h5>2</h5>
                <button>CHECK</button>
            </div>
            
        </div>
    )
}
