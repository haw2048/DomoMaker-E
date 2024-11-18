const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const country = e.target.querySelector('#domoCountry').value;

    if(!name || !age || !country){
        helper.handleError('All fields are required!');
        return false;
    } 

    helper.sendPost(e.target.action, {name, age, country}, onDomoAdded);

    return false;

}

const handleDelete = (e, onDomoAdded, domo) => {
    e.preventDefault();
    helper.hideError();

    helper.sendDelete(e.target.action, domo, onDomoAdded);

    return false;

}

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="country">Birth Country: </label>
            <input id="domoCountry" type="text" name="country" placeholder="Domo Favorite country" />
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="number" min="0" name="age" />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
};

const DomoList = (props) => {
    const [domos, setDomos] =useState(props.domos);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();

    }, [props.reloadDomos]);

    if(domos.length === 0 ){
        return(
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    const domoNodes = domos.map(domo => {
        return(
            <form id="domoDelete"
            onSubmit={(e) => handleDelete(e, props.triggerReload, domo)}
            name="domoDelete"
            action="/maker"
            method="DELETE"
            className="domoDelete"
            >
                <div key={domo.id} className="domo">
                    <img src="assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
                    <h3 className="domoName">Name: {domo.name}</h3>
                    <h3 className="domoCountry">Birth Country: {domo.country}</h3>
                    <h3 className="domoAge">Age: {domo.age}</h3>
                    <input className="makeDomoDelete" type="submit" value="Delete" />

                </div>
            </form>
        );
    });

    return(
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return (
        <div>
            <div id="makeDomo">
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
            <div id="domos">
                <DomoList domos={[]} reloadDomos={reloadDomos} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;