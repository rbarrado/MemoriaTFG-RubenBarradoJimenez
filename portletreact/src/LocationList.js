import React from 'react';
import ChartDay from './ChartDay';
import ChartWeek from './ChartWeek';

const views = [
	'Diaria', 'Semanal'
];

export default class extends React.Component {
    constructor(props) {
        super(props);

        this.state = {view: 'Diaria'};
    }

    onSelectView(e) {
		this.setState({view: e.target.value})
		console.log(this.state.view);
	}

	render() {
		return (
            <div>
                <div>
                    <h1 style={{marginLeft: '2.5%'}}>
                        {this.props.city}
                    </h1>
                    <div>
                        <label style={{fontSize: '15px', marginLeft: '2.5%'}}>
                            <b>Seleccione el tipo de visualización</b>
                        </label>
                        <label>:      </label>
                        <select
                            id="modal-bill-select"
                            name="modal-bill-select"
                            style={{borderRadius: '23px 23px 23px 23px', backgroundColor: '#F0F8FF', color: '#2F4F4F'}}
                            onChange={e => this.onSelectView(e)}
                        >
                            {views.map((item) => {
                                return (
                                    <option
                                        value={item}
                                    >
                                        {item}
                                    </option>);
                            })}
                        </select>
                    </div>
                </div>    
                <br></br>
                <div>
                    {this.state.view !== 'Semanal' ?
                        <div>
                            <ChartDay
                                city={this.props.city} >
                            </ChartDay>
                        </div>
                        : 
                        <div>
                            <ChartWeek
                                city={this.props.city} >
                            </ChartWeek>
                        </div> 
                    }
                </div>

            </div>
		);
	}	
}