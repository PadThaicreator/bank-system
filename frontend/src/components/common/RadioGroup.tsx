import React from 'react'
import styles from './RadioGroup.module.css'

type Options = {
    label: string;
    value: string;
}

type RadioGroupProps = {
    options: Options[];
    selected: string;
    onChange: (value: string) => void
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
    options,
    selected,
    onChange
}) => {
    return (
        <div className={styles.radioGroup} role='radio-group'>
            {options.map((opt) => (
                <label 
                    key={opt.value} 
                    className={`${styles.radioLabel} ${opt.value === selected ? styles.radioLabelSelected : ''}`}
                >
                    <input
                        className={styles.radioInput}
                        type='radio'
                        name='radio-group'
                        value={opt.value}
                        checked={opt.value === selected}
                        onChange={() => onChange(opt.value)}
                    />
                    {opt.label}
                </label>
            ))}
        </div>
    )
}

export default RadioGroup