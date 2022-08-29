import * as React from 'react';
import * as ReactDom from 'react-dom'
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'ResouceAccordianWebPartStrings';
import ResouceAccordian from './components/ResouceAccordian';
import { IResouceAccordianProps } from './components/IResouceAccordianProps';
import { getSP } from '../../pnpjs-config';

export interface IResouceAccordianWebPartProps {
  listname: string;
  topheading: string
}

export default class ResouceAccordianWebPart extends BaseClientSideWebPart<IResouceAccordianWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IResouceAccordianProps> = React.createElement(
      ResouceAccordian,
      {
        listname: this.properties.listname,
        topheading: this.properties.topheading
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();
    getSP(this.context);
    return super.onInit();
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }
  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }
  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('topheading', {
                  label: 'Title'
                }),
                PropertyPaneTextField('listname', {
                  label: 'List Name'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
