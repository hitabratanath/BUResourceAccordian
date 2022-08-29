
import { Logger, LogLevel } from '@pnp/logging'
import * as React from 'react'
import { getSP } from '../../../pnpjs-config'
import AccordianItem from './AccordianItem'
import styles from './ResouceAccordian.module.scss'
import "@pnp/sp/views";
import "@pnp/sp/fields"

const ResouceAccordian = ({ listname, topheading }) => {
  const [data, setData] = React.useState([])
  const [processedData, setProcessedData] = React.useState([])
  const _sp = getSP()
  // --------------------------------------------------------------------------------------------------
  React.useEffect(() => {
    async function check() {
      const ensureList = await _sp.web.lists.ensure(listname)
      if (ensureList.created) {
        console.log('list created , adding columns now!!');
        createColumns().then(() => {
          addColumnsToView().then(() => {
            console.log('view addition done!!');

          })
        })
      }
      else {
        console.log('list already present fetching data now!!');
        _sp.web.lists.getByTitle(listname).items.orderBy('SortOrder')().then(resp => setData(resp));
      }
    }

    if (listname !== undefined)
      check()

  }, [listname, topheading])
  // --------------------------------------------------------------------------------------------------
  React.useEffect(() => {
    if (data.length > 0) {
      var groupBy = function (xs, key) {
        return xs.reduce(function (rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      };
      var groubedByTeam = groupBy(data, 'Title')
      let finalArray = []
      for (let val in groubedByTeam) {
        finalArray.push(groubedByTeam[val])
      }
      setProcessedData(finalArray)
    }
  }, [data])
  // --------------------------------------------------------------------------------------------------
  async function createColumns() {
    try {
      let fieldsToCreate = [
        '<Field Type="URL" Name="RedirectionLink" DisplayName="RedirectionLink" Required="TRUE"><Default></Default></Field>',
        '<Field Type="Number" Name="SortOrder" DisplayName="SortOrder" Required="TRUE"><Default></Default></Field>',
        '<Field Type="Text" Name="SubTitle" DisplayName="SubTitle" Required="TRUE"><Default></Default></Field>',
      ];

      for (let i = 0; i < fieldsToCreate.length; i++) {
        await _sp.web.lists.getByTitle(listname).fields.createFieldAsXml(fieldsToCreate[i])
      }
    } catch (err) {
      Logger.write(
        `${this.LOG_SOURCE} (createColumns) - ${JSON.stringify(err)} - `,
        LogLevel.Error
      );
    }
  }
  // --------------------------------------------------------------------------------------------------
  async function addColumnsToView() {
    await _sp.web.lists.getByTitle(listname).views.getByTitle('All Items').fields.add('RedirectionLink')
    await _sp.web.lists.getByTitle(listname).views.getByTitle('All Items').fields.add('SortOrder')
    await _sp.web.lists.getByTitle(listname).views.getByTitle('All Items').fields.add('SubTitle')
  }
  // --------------------------------------------------------------------------------------------------
  return (
    <div className={styles.accordianContainer}>
      <p className={styles.topheading}>{topheading}</p>
      {processedData.length > 0 ? processedData.map(item => <AccordianItem item={item} />) : null}
    </div>
  )
}

export default ResouceAccordian
