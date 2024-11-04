function Navbar() {
    return (
        <div className="navbar bg-blue-500 rounded-md text-cyan-50">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">Edugo</a>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    <li><a>Link</a></li>
                    <li>
                        <details>
                            <summary>Parent</summary>
                            <ul className="bg-blue-300 rounded-t-none p-2">
                                <li><a>Link 1</a></li>
                                <li><a>Link 2</a></li>
                            </ul>
                        </details>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Navbar