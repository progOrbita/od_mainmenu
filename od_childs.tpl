{*
{function name="menu" nodes=[] depth=0}
  {strip}
    {if $nodes|count}
      <ul data-depth="{$depth}">
        {foreach from=$nodes item=node}
          <li class="{$node.type}{if $node.current} current{/if}">
            <a href="{$node.url}" {if $node.open_in_new_window} target="_blank" {/if}>{$node.label}</a>
            <div>
              {menu nodes=$node.children depth=$node.depth}
              {if $node.image_urls|count}
                <div class="menu-images-container">
                  {foreach from=$node.image_urls item=image_url}
                    <img src="{$image_url}">
                  {/foreach}
                </div>
              {/if}
            </div>
          </li>
        {/foreach}
      </ul>
    {/if}
  {/strip}
{/function}

<div class="menu">
    {menu nodes=$menu.children}
</div>
*}

{assign var=_counter value=0}
{function name="menu" nodes=[] depth=0 parent=null}
  {if $nodes|count}
    {if $depth > 0}<ul class="top-menu" data-depth="{$depth}">{/if}
      {foreach from=$nodes item=node}
        {assign var=_haschild value=$node.children|count}
          {if $depth > 0}<li class="{$node.type}{if $node.current} current {/if}" id="{$node.page_identifier}">{/if}
            <div class="item-header">
              <a class="nav-link" href="{$node.url}" data-depth="{$depth}"{if $node.open_in_new_window} target="_blank"{/if}>{$node.label}</a>
            </div>
          {/if}
          {if $_haschild}
              <div class="collapse" id="top_sub_menu_{$_expand_id}">
                {menu nodes=$node.children depth=$node.depth parent=$node}
          {/if}
        </li>
      {/foreach}
    </ul>
  {/if}
{/function}

{*<div class="menu js-top-menu col">*}
    {menu nodes=$menu.children depth=1}
{*</div>*}
