import { h, Component } from 'preact';

export default function FormInputRow({ className = '', label = '', type = 'text', value = '', disabled = false, autoComplete = "on", onChange = (value: any)=>{} }) {
	return (
        <div class={'input-row ' + className}>

            <label>{label}</label>

            <div class="input-row">
                <input
                    type={type}
                    /*value={value}*/
                    disabled={disabled}
                    onChange={onChange}
                    autoComplete={autoComplete}
                />
            </div>

        </div>
	);
}

