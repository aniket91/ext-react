import React, { Component } from 'react';
import { FormPanel, ComboBoxField } from '@sencha/ext-modern';
import data from './data';

export default class MultiSelectComboBoxFieldExample extends Component {

    render() {
        return (
            <FormPanel shadow>
                <ComboBoxField
                    multiSelect
                    width={200}
                    label="State"
                    store={data}
                    displayField="name"
                    valueField="abbrev"
                    queryMode="local"
                    labelAlign="placeholder"
                    clearable
                />
            </FormPanel>
        )
    }

}